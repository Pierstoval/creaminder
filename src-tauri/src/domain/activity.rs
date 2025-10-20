use rusqlite::Connection;
use serde::Deserialize;
use serde::Serialize;

#[derive(Debug, Serialize, Deserialize)]
pub(crate) struct Activity {
    pub(crate) id: u32,
    pub(crate) title: String,
}

pub(crate) fn find_all(conn: &Connection) -> Vec<Activity> {
    let mut stmt = conn
        .prepare(
            "
        SELECT
            id,
            title
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
