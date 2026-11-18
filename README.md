# Triage Router

A small ServiceNow application that links new incidents to the caller's laptop in the Configuration Management Database (CMDB), routes hardware related incidents to a Hardware group, and displays each user's open incident count on a Service Portal page. A Pytest suite validates the REST API, and a GitHub Actions workflow runs it on every push.

This is a personal project built on a ServiceNow Personal Developer Instance (PDI). It is not intended for production use.

## Features
- **CMDB linking:** A Business Rule on the Incident table sets `cmdb_ci` to the computer CI assigned to the caller.
- **Hardware routing:** Incidents whose category is `hardware`, or whose short description mentions a laptop, computer, monitor, keyboard, or printer, are assigned to the **Hardware** group.
- **Open incident count:** A Script Include (`TriageUtils`) uses `GlideAggregate` to count active incidents for a user.
- **REST API:** A Scripted REST API resource returns the open incident count for a given user `sys_id`.
- **Service Portal widget:** An AngularJS widget shows the logged-in user's name and open incident count, colored red when the count is above zero and green when it is zero.
- **Automated tests:** Pytest tests check the REST endpoint's status codes and response format. GitHub Actions runs them on push and pull request.

## Architecture

```
Incident insert
   │
   ▼
Business Rule (before insert)
   ├── Link caller's CI from cmdb_ci_computer
   └── Route hardware incidents to "Hardware" group

GET /api/<scope>/triage/open-count/{user_id}
   │
   ▼
Scripted REST Resource ──► TriageUtils.getOpenIncidentCount()
                                  │
                                  ▼
                           GlideAggregate on incident

Service Portal widget "Triage Open Count"
   └── Server script calls TriageUtils for the current user
```

## Repository Layout

```
servicenow-triage-app/
├── .github/workflows/test.yml     # GitHub Actions pipeline
├── servicenow/                    # Exported ServiceNow application files
├── tests/test_triage_api.py       # Pytest tests for the REST endpoint
├── .gitignore
├── requirements.txt
└── README.md
```

## Prerequisites

- A ServiceNow PDI from [developer.servicenow.com](https://developer.servicenow.com)
- Admin access to the PDI
- Python 3.11 or later (for running tests locally)
- A GitHub account

## Setup

### 1. Import or recreate the application

Either import the exported files from `servicenow/` into your PDI, or build the app manually in Studio as a scoped application named **Triage Router**. The scope is `x_<your-scope>_triage`.

### 2. Create test data

- **CI:** Create a computer record in **Configuration > Computers** named `LAPTOP-TEST-01` and assign it to a demo user.
- **Group:** Create a group named **Hardware** in **User Administration > Groups**.

### 3. Configure the Scripted REST API

The Scripted REST API resource requires authentication. Its Default ACL must be set to an ACL for the Triage Router scope with type `rest_endpoint`, operation `read`, and an appropriate role.

### 4. Add the widget to a page

In **Service Portal > Designer**, switch the application picker to **Global** (widget placement requires the Global scope), open a page, and drag **Triage Open Count** onto it.

## Running the Tests

Set these environment variables:

| Variable | Description |
|---|---|
| `SN_INSTANCE` | Instance name, e.g. `dev12345` |
| `SN_USER` | ServiceNow username with API access |
| `SN_PASSWORD` | Password for that user |
| `SN_TEST_USER_SYS_ID` | `sys_id` of the user to query |

Set the scope in `tests/test_triage_api.py` to match your application.

```bash
pip install -r requirements.txt
export SN_INSTANCE=dev12345
export SN_USER=admin
export SN_PASSWORD='your-password'
export SN_TEST_USER_SYS_ID=your-user-sys-id
pytest -v
```

On Windows PowerShell, use `$env:SN_INSTANCE="dev12345"` in place of `export`.

## CI/CD

The workflow in `.github/workflows/test.yml` runs on pushes to `main` and on pull requests. It installs dependencies and runs `pytest -v` using four repository secrets:

- `SN_INSTANCE`
- `SN_USER`
- `SN_PASSWORD`
- `SN_TEST_USER_SYS_ID`

Add these under **Settings > Secrets and variables > Actions**. Never commit credentials to the repository.

## Testing the Routing Manually

1. Log in as the test user and create three incidents with the short description "Laptop won't boot." Each should be assigned to the Hardware group and linked to `LAPTOP-TEST-01`.
2. Create two incidents with the short description "Password reset." These should not be assigned to the Hardware group.
3. Confirm the results on each record.

## Example API Call

```bash
curl -u "$SN_USER:$SN_PASSWORD" \
  "https://$SN_INSTANCE.service-now.com/api/<your-scope>/triage/open-count/$SN_TEST_USER_SYS_ID"
```

Example response:

```json
{
  "result": {
    "user_id": "...",
    "user_name": "...",
    "open_incidents": 3
  }
}
```

## Known Limitations

- Hardware routing uses keyword matching in the short description, so it can misroute incidents with ambiguous wording.
- The CMDB link uses the first computer CI assigned to the caller and ignores other CIs.
- The widget and REST endpoint have not been hardened for production use, including rate limiting and fine-grained role checks.
- The app was developed and tested on a PDI, not a production instance.

## Future Improvements

- Replace keyword routing with Flow Designer or a Assignment Rule
- Add tests for the Business Rule routing logic
- Add a SOAP endpoint for the same data
