use chrono::DateTime;
use chrono::Local;
use rusqlite::named_params;
use rusqlite::Connection;
use serde::Deserialize;
use serde::Serialize;
use serde_rusqlite::error::Result as SerdeResult;

#[derive(Debug, Serialize, Deserialize)]
pub(crate) struct Activity {
    pub(crate) id: u32,
    pub(crate) description: String,
    pub(crate) date: DateTime<Local>,
}

pub(crate) fn find_all(conn: &Connection) -> Vec<Activity> {
    let mut stmt = conn
        .prepare(
            "
        SELECT
            id,
            description,
            `date`
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
                dbg!(&activity);
                let activity = activity.expect("Could not deserialize Activity item");
                activities.push(activity);
            }
        }
    }

    activities
}

pub(crate) fn create(conn: &Connection, description: Option<String>, date: Option<String>) -> Result<Activity, String> {
    let description = description.unwrap_or(String::from(""));

    if date.is_some() {
        let date_rfc = DateTime::parse_from_rfc3339(&date.clone().unwrap());

        if date_rfc.is_err() {
            return Err(date_rfc.unwrap_err().to_string());
        }
    }

    let date_rfc: DateTime<Local> = if date.is_none() {
        Local::now()
    } else {
        let date_rfc = DateTime::parse_from_rfc3339(&date.clone().unwrap());

        if date_rfc.is_err() {
            return Err(date_rfc.unwrap_err().to_string());
        }

        date_rfc.unwrap().into()
    };

    let mut stmt = conn.prepare("INSERT INTO activities ( description, date ) VALUES ( :description, :date )").unwrap();

    stmt.execute(named_params! {
        ":description": &description.clone(),
        ":date": format!("{}", &date_rfc.format("%Y-%m-%dT%H:%M:%S%z")),
    }).unwrap();

    let id = conn.last_insert_rowid();

    let mut stmt = conn.prepare("select id, description, date from activities where id = :id").unwrap();

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
