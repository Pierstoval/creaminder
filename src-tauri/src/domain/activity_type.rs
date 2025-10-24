use rusqlite::named_params;
use rusqlite::Connection;
use serde::Deserialize;
use serde::Serialize;
use serde_rusqlite::error::Result as SerdeResult;

#[derive(Debug, Serialize, Deserialize)]
pub(crate) struct ActivityType {
    pub(crate) id: u32,
    pub(crate) name: String,
    pub(crate) description: Option<String>,
}

pub(crate) fn find_all(conn: &Connection) -> Vec<ActivityType> {
    let mut stmt = conn
        .prepare(
            "
        SELECT
            id,
            name,
            description
        FROM activity_types
        ORDER BY name ASC
    ",
        )
        .expect("Could not fetch activity types");

    let mut activity_types: Vec<ActivityType> = Vec::new();

    let mut rows_iter = serde_rusqlite::from_rows::<ActivityType>(stmt.query([]).unwrap());

    loop {
        match rows_iter.next() {
            None => {
                break;
            }
            Some(activity_type) => {
                let activity_type = activity_type.expect("Could not deserialize ActivityType item");
                activity_types.push(activity_type);
            }
        }
    }

    activity_types
}

pub(crate) fn create(conn: &Connection, name: String, description: Option<String>) -> Result<ActivityType, String> {
    if name.trim().is_empty() {
        return Err("Activity type name cannot be empty".to_string());
    }

    let mut stmt = conn.prepare("INSERT INTO activity_types ( name, description ) VALUES ( :name, :description )").unwrap();

    let result = stmt.execute(named_params! {
        ":name": &name,
        ":description": &description,
    });

    if let Err(e) = result {
        return Err(e.to_string());
    }

    let id = conn.last_insert_rowid();

    let mut stmt = conn.prepare("SELECT id, name, description FROM activity_types WHERE id = :id").unwrap();

    let mut rows = stmt
        .query(named_params! {
            ":id": &id,
        })
        .unwrap();

    let row = rows
        .next()
        .expect("Could not retrieve query rows.")
        .expect("No item found with this ID.");

    let data: SerdeResult<ActivityType> = serde_rusqlite::from_row::<ActivityType>(row);

    if data.is_ok() {
        return Ok(data.unwrap());
    }

    Err(data.unwrap_err().to_string())
}

pub(crate) fn update(conn: &Connection, id: i32, name: String, description: Option<String>) -> Result<ActivityType, String> {
    if name.trim().is_empty() {
        return Err("Activity type name cannot be empty".to_string());
    }

    let mut stmt = conn.prepare("UPDATE activity_types SET name = :name, description = :description WHERE id = :id").unwrap();

    let result = stmt.execute(named_params! {
        ":id": &id,
        ":name": &name,
        ":description": &description,
    });

    if let Err(e) = result {
        return Err(e.to_string());
    }

    let rows_affected = result.unwrap();
    if rows_affected == 0 {
        return Err("Activity type not found".to_string());
    }

    let mut stmt = conn.prepare("SELECT id, name, description FROM activity_types WHERE id = :id").unwrap();

    let mut rows = stmt
        .query(named_params! {
            ":id": &id,
        })
        .unwrap();

    let row = rows
        .next()
        .expect("Could not retrieve query rows.")
        .expect("No item found with this ID.");

    let data: SerdeResult<ActivityType> = serde_rusqlite::from_row::<ActivityType>(row);

    if data.is_ok() {
        return Ok(data.unwrap());
    }

    Err(data.unwrap_err().to_string())
}

pub(crate) fn find_by_id(conn: &Connection, id: i32) -> Result<ActivityType, String> {
    let mut stmt = conn.prepare("SELECT id, name, description FROM activity_types WHERE id = :id").unwrap();

    let mut rows = stmt
        .query(named_params! {
            ":id": &id,
        })
        .unwrap();

    let row = rows
        .next()
        .expect("Could not retrieve query rows.");

    if row.is_none() {
        return Err("Activity type not found".to_string());
    }

    let data: SerdeResult<ActivityType> = serde_rusqlite::from_row::<ActivityType>(row.unwrap());

    if data.is_ok() {
        return Ok(data.unwrap());
    }

    Err(data.unwrap_err().to_string())
}

pub(crate) fn delete(conn: &Connection, id: i32) -> Result<usize, rusqlite::Error> {
    let mut stmt = conn.prepare("DELETE FROM activity_types WHERE id = :id")?;

    stmt.execute(named_params! {":id": &id})
}
