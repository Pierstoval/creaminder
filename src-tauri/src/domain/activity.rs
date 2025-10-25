use chrono::DateTime;
use chrono::FixedOffset;
use chrono::Local;
use rusqlite::named_params;
use rusqlite::Connection;
use serde::Deserialize;
use serde::Serialize;
use serde_rusqlite::error::Result as SerdeResult;

const DATE_FORMAT: &str = "%Y-%m-%dT%H:%M:%S%z";

#[derive(Debug, Serialize, Deserialize)]
pub(crate) struct Activity {
    pub(crate) id: u32,
    pub(crate) description: String,
    pub(crate) date: String,
    pub(crate) activity_type_id: Option<u32>,
}

pub(crate) fn find_all(conn: &Connection) -> Vec<Activity> {
    let mut stmt = conn
        .prepare(
            "
        SELECT
            id,
            description,
            `date`,
            activity_type_id
        FROM activities
        ORDER BY id DESC
    ",
        )
        .expect("Could not fetch activities");

    let mut activities: Vec<Activity> = Vec::new();

    let mut rows_iter = serde_rusqlite::from_rows::<Activity>(stmt.query([]).unwrap());

    loop {
        match rows_iter.next() {
            None => {
                break;
            }
            Some(activity) => {
                let activity = activity.expect("Could not deserialize Activity item");
                activities.push(activity);
            }
        }
    }

    activities
}

pub(crate) fn find_by_activity_type(conn: &Connection, activity_type_id: Option<u32>) -> Vec<Activity> {
    let sql = match activity_type_id {
        Some(_) => "
        SELECT
            id,
            description,
            `date`,
            activity_type_id
        FROM activities
        WHERE activity_type_id = :activity_type_id
        ORDER BY id DESC
        ",
        None => "
        SELECT
            id,
            description,
            `date`,
            activity_type_id
        FROM activities
        ORDER BY id DESC
        ",
    };

    let mut stmt = conn
        .prepare(sql)
        .expect("Could not fetch activities");

    let mut activities: Vec<Activity> = Vec::new();

    let rows_result = if let Some(type_id) = activity_type_id {
        stmt.query(named_params! {":activity_type_id": type_id})
    } else {
        stmt.query([])
    };

    let mut rows_iter = serde_rusqlite::from_rows::<Activity>(rows_result.unwrap());

    loop {
        match rows_iter.next() {
            None => {
                break;
            }
            Some(activity) => {
                let activity = activity.expect("Could not deserialize Activity item");
                activities.push(activity);
            }
        }
    }

    activities
}

pub(crate) fn create(conn: &Connection, description: Option<String>, date: Option<String>, activity_type_id: Option<u32>) -> Result<Activity, String> {
    let description = description.unwrap_or(String::from(""));

    let date_rfc: DateTime<FixedOffset>;
    if date.is_some() {
        let checked_date = DateTime::parse_from_str(&date.clone().unwrap(), DATE_FORMAT);

        if checked_date.is_err() {
            return Err(checked_date.unwrap_err().to_string());
        }

        date_rfc = checked_date.unwrap().into();
    } else {
        date_rfc = Local::now().into();
    }

    let mut stmt = conn.prepare("INSERT INTO activities ( description, date, activity_type_id ) VALUES ( :description, :date, :activity_type_id )").unwrap();

    stmt.execute(named_params! {
        ":description": &description.clone(),
        ":date": format!("{}", &date_rfc.format(DATE_FORMAT)),
        ":activity_type_id": &activity_type_id,
    }).unwrap();

    let id = conn.last_insert_rowid();

    let mut stmt = conn.prepare("select id, description, date, activity_type_id from activities where id = :id").unwrap();

    let mut rows = stmt
        .query(named_params! {
            ":id": &id,
        })
        .unwrap();

    let row = rows
        .next()
        .expect("Could not retrieve query rows.")
        .expect("No item found with this ID.");

    let data: SerdeResult<Activity> = serde_rusqlite::from_row::<Activity>(row);

    if data.is_ok() {
        return Ok(data.unwrap());
    }

    Err(data.unwrap_err().to_string())
}

pub(crate) fn update(
    conn: &Connection,
    id: i32,
    description: Option<String>,
    date: Option<String>,
    activity_type_id: Option<u32>,
) -> Result<Activity, String> {
    let description = description.unwrap_or(String::from(""));

    let date_rfc: DateTime<FixedOffset>;
    if let Some(date_str) = date {
        let checked_date = DateTime::parse_from_str(&date_str, DATE_FORMAT);

        if checked_date.is_err() {
            return Err(checked_date.unwrap_err().to_string());
        }

        date_rfc = checked_date.unwrap().into();
    } else {
        date_rfc = Local::now().into();
    }

    let mut stmt = conn.prepare("UPDATE activities SET description = :description, date = :date, activity_type_id = :activity_type_id WHERE id = :id").unwrap();

    let result = stmt.execute(named_params! {
        ":id": &id,
        ":description": &description,
        ":date": format!("{}", &date_rfc.format(DATE_FORMAT)),
        ":activity_type_id": &activity_type_id,
    });

    if let Err(e) = result {
        return Err(e.to_string());
    }

    let rows_affected = result.unwrap();
    if rows_affected == 0 {
        return Err("Activity not found".to_string());
    }

    let mut stmt = conn.prepare("SELECT id, description, date, activity_type_id FROM activities WHERE id = :id").unwrap();

    let mut rows = stmt
        .query(named_params! {
            ":id": &id,
        })
        .unwrap();

    let row = rows
        .next()
        .expect("Could not retrieve query rows.")
        .expect("No item found with this ID.");

    let data: SerdeResult<Activity> = serde_rusqlite::from_row::<Activity>(row);

    if data.is_ok() {
        return Ok(data.unwrap());
    }

    Err(data.unwrap_err().to_string())
}

pub(crate) fn find_by_id(conn: &Connection, id: i32) -> Result<Activity, String> {
    let mut stmt = conn.prepare("SELECT id, description, date, activity_type_id FROM activities WHERE id = :id").unwrap();

    let mut rows = stmt
        .query(named_params! {
            ":id": &id,
        })
        .unwrap();

    let row = rows
        .next()
        .expect("Could not retrieve query rows.");

    if row.is_none() {
        return Err("Activity not found".to_string());
    }

    let data: SerdeResult<Activity> = serde_rusqlite::from_row::<Activity>(row.unwrap());

    if data.is_ok() {
        return Ok(data.unwrap());
    }

    Err(data.unwrap_err().to_string())
}

pub(crate) fn delete(conn: &Connection, id: i32) -> Result<usize, rusqlite::Error> {
    let mut stmt = conn.prepare("DELETE FROM activities WHERE id = :id")?;

    stmt.execute(named_params! {":id": &id})
}
