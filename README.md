# 🏥 PlatinumRx Data Analyst Assignment

> **Candidate:** Savita Teggi  
> **Role Applied:** Data Analyst  
> **Repository:** [PlatinumRx_Assignment](https://github.com/savitateggi/PlatinumRx_Assignment)  
> **Assignment Reference:** PlatinumRx DA Assignment

---

## 📋 Table of Contents

- [Overview](#overview)
- [Repository Structure](#repository-structure)
- [Section A — SQL: Hotel Management System](#section-a--sql-hotel-management-system)
- [Section B — SQL: Clinic Management System](#section-b--sql-clinic-management-system)
- [Section C — Spreadsheet Proficiency](#section-c--spreadsheet-proficiency)
- [Section D — Python Proficiency](#section-d--python-proficiency)
- [How to Run](#how-to-run)
- [Tech Stack](#tech-stack)

---

## Overview

This repository contains complete solutions to the **PlatinumRx Data Analyst Assignment**, covering four key competency areas:

| Section | Topic | Skills Demonstrated |
|---------|-------|---------------------|
| A | SQL — Hotel Management | Window functions, JOINs, aggregations, CTEs |
| B | SQL — Clinic Management | Revenue analysis, profitability ranking, DENSE_RANK |
| C | Spreadsheet (Excel) | INDEX/MATCH, SUMPRODUCT, date/time functions |
| D | Python | String manipulation, integer arithmetic, loops |

---

## Repository Structure

```
PlatinumRx_Assignment/
│
├── README.md                          # This file
│
├── sql/
│   ├── hotel_management/
│   │   ├── schema.sql                 # Table definitions for hotel system
│   │   ├── q1_last_booked_room.sql    # User's last booked room
│   │   ├── q2_november_billing.sql    # November 2021 billing totals
│   │   ├── q3_october_bills_1000.sql  # October bills > ₹1000
│   │   ├── q4_most_least_ordered.sql  # Most/least ordered item per month
│   │   └── q5_second_highest_bill.sql # Second highest bill per month
│   │
│   └── clinic_management/
│       ├── schema.sql                 # Table definitions for clinic system
│       ├── q1_revenue_by_channel.sql  # Revenue per sales channel
│       ├── q2_top10_customers.sql     # Top 10 valuable customers
│       ├── q3_monthly_pnl.sql         # Monthly revenue/expense/profit
│       ├── q4_most_profitable_city.sql  # Most profitable clinic per city
│       └── q5_second_least_state.sql  # 2nd least profitable per state
│
├── spreadsheet/
│   └── spreadsheet_solutions.md      # Formula explanations & approaches
│
├── python/
│   ├── minutes_converter.py          # Q1: Minutes → human readable
│   └── remove_duplicates.py          # Q2: Remove duplicate characters
│
└── solutions/
    └── PlatinumRx_Assignment_Solutions.xlsx   # Complete spreadsheet solution
```

---

## Section A — SQL: Hotel Management System

### Schema

```
users              → user_id, name, phone_number, mail_id, billing_address
bookings           → booking_id, booking_date, room_no, user_id
booking_commercials→ id, booking_id, bill_id, bill_date, item_id, item_quantity
items              → item_id, item_name, item_rate
```

---

### Q1 — Last Booked Room per User

```sql
SELECT
    u.user_id,
    b.room_no
FROM users u
JOIN (
    SELECT
        user_id,
        room_no,
        ROW_NUMBER() OVER (
            PARTITION BY user_id
            ORDER BY booking_date DESC
        ) AS rn
    FROM bookings
) b ON u.user_id = b.user_id AND b.rn = 1;
```

**Approach:** `ROW_NUMBER()` window function partitioned by `user_id`, ordered by `booking_date DESC` picks the most recent booking per user.

---

### Q2 — November 2021 Booking Billing Totals

```sql
SELECT
    b.booking_id,
    SUM(bc.item_quantity * i.item_rate) AS total_billing_amount
FROM bookings b
JOIN booking_commercials bc ON b.booking_id = bc.booking_id
JOIN items i ON bc.item_id = i.item_id
WHERE YEAR(b.booking_date) = 2021
  AND MONTH(b.booking_date) = 11
GROUP BY b.booking_id;
```

**Approach:** Three-table JOIN, filter on `booking_date` month/year, multiply `item_quantity × item_rate`, sum per booking.

---

### Q3 — October 2021 Bills with Amount > 1000

```sql
SELECT
    bc.bill_id,
    SUM(bc.item_quantity * i.item_rate) AS bill_amount
FROM booking_commercials bc
JOIN items i ON bc.item_id = i.item_id
WHERE YEAR(bc.bill_date) = 2021
  AND MONTH(bc.bill_date) = 10
GROUP BY bc.bill_id
HAVING SUM(bc.item_quantity * i.item_rate) > 1000;
```

**Approach:** `HAVING` (not `WHERE`) filters on the aggregated total since the condition applies post-grouping.

---

### Q4 — Most and Least Ordered Item per Month (2021)

```sql
WITH monthly_totals AS (
    SELECT
        MONTH(bc.bill_date) AS month_num,
        bc.item_id,
        i.item_name,
        SUM(bc.item_quantity) AS total_qty
    FROM booking_commercials bc
    JOIN items i ON bc.item_id = i.item_id
    WHERE YEAR(bc.bill_date) = 2021
    GROUP BY MONTH(bc.bill_date), bc.item_id, i.item_name
),
ranked AS (
    SELECT *,
        RANK() OVER (PARTITION BY month_num ORDER BY total_qty DESC) AS rank_desc,
        RANK() OVER (PARTITION BY month_num ORDER BY total_qty ASC)  AS rank_asc
    FROM monthly_totals
)
SELECT
    month_num,
    MAX(CASE WHEN rank_desc = 1 THEN item_name END) AS most_ordered_item,
    MAX(CASE WHEN rank_asc  = 1 THEN item_name END) AS least_ordered_item
FROM ranked
WHERE rank_desc = 1 OR rank_asc = 1
GROUP BY month_num
ORDER BY month_num;
```

**Approach:** CTE aggregates quantities by month/item. Second CTE applies `RANK()` in both directions. Final `SELECT` pivots both ranks into a single row per month.

---

### Q5 — Second Highest Bill Value per Month (2021)

```sql
WITH bill_totals AS (
    SELECT
        u.user_id, u.name, bc.bill_id,
        MONTH(bc.bill_date) AS month_num,
        SUM(bc.item_quantity * i.item_rate) AS bill_value
    FROM booking_commercials bc
    JOIN bookings bk ON bc.booking_id = bk.booking_id
    JOIN users u ON bk.user_id = u.user_id
    JOIN items i ON bc.item_id = i.item_id
    WHERE YEAR(bc.bill_date) = 2021
    GROUP BY u.user_id, u.name, bc.bill_id, MONTH(bc.bill_date)
),
ranked AS (
    SELECT *,
        DENSE_RANK() OVER (
            PARTITION BY month_num ORDER BY bill_value DESC
        ) AS dr
    FROM bill_totals
)
SELECT month_num, user_id, name, bill_id, bill_value
FROM ranked
WHERE dr = 2
ORDER BY month_num;
```

**Approach:** `DENSE_RANK()` ensures rank 2 is always the second highest even when multiple records share rank 1.

---

## Section B — SQL: Clinic Management System

### Schema

```
clinics       → cid, clinic_name, city, state, country
customer      → uid, name, mobile
clinic_sales  → oid, uid, cid, amount, datetime, sales_channel
expenses      → eid, cid, description, amount, datetime
```

---

### Q1 — Revenue per Sales Channel (Given Year)

```sql
SELECT
    sales_channel,
    SUM(amount) AS total_revenue
FROM clinic_sales
WHERE YEAR(datetime) = :year
GROUP BY sales_channel
ORDER BY total_revenue DESC;
```

---

### Q2 — Top 10 Most Valuable Customers (Given Year)

```sql
SELECT
    cs.uid, c.name,
    SUM(cs.amount)  AS total_spend,
    COUNT(cs.oid)   AS total_orders
FROM clinic_sales cs
JOIN customer c ON cs.uid = c.uid
WHERE YEAR(cs.datetime) = :year
GROUP BY cs.uid, c.name
ORDER BY total_spend DESC
LIMIT 10;
```

---

### Q3 — Month-wise Revenue, Expense, Profit & Status

```sql
WITH monthly_revenue AS (
    SELECT MONTH(datetime) AS month_num, SUM(amount) AS revenue
    FROM clinic_sales WHERE YEAR(datetime) = :year GROUP BY MONTH(datetime)
),
monthly_expense AS (
    SELECT MONTH(datetime) AS month_num, SUM(amount) AS expense
    FROM expenses WHERE YEAR(datetime) = :year GROUP BY MONTH(datetime)
)
SELECT
    COALESCE(r.month_num, e.month_num)      AS month_num,
    COALESCE(r.revenue, 0)                   AS revenue,
    COALESCE(e.expense, 0)                   AS expense,
    COALESCE(r.revenue, 0) - COALESCE(e.expense, 0) AS profit,
    CASE
        WHEN COALESCE(r.revenue, 0) - COALESCE(e.expense, 0) > 0
        THEN 'Profitable' ELSE 'Not Profitable'
    END AS status
FROM monthly_revenue r
FULL OUTER JOIN monthly_expense e ON r.month_num = e.month_num
ORDER BY month_num;
```

**Approach:** Two CTEs + `FULL OUTER JOIN` ensures all months appear. `COALESCE` handles NULLs for months missing in either table.

---

### Q4 — Most Profitable Clinic per City (Given Month)

```sql
WITH clinic_profit AS (
    SELECT cl.cid, cl.clinic_name, cl.city,
        COALESCE(SUM(cs.amount), 0) - COALESCE(SUM(ex.amount), 0) AS profit
    FROM clinics cl
    LEFT JOIN clinic_sales cs ON cl.cid = cs.cid
        AND YEAR(cs.datetime) = :year AND MONTH(cs.datetime) = :month
    LEFT JOIN expenses ex ON cl.cid = ex.cid
        AND YEAR(ex.datetime) = :year AND MONTH(ex.datetime) = :month
    GROUP BY cl.cid, cl.clinic_name, cl.city
),
ranked AS (
    SELECT *, RANK() OVER (PARTITION BY city ORDER BY profit DESC) AS rnk
    FROM clinic_profit
)
SELECT city, cid, clinic_name, profit FROM ranked WHERE rnk = 1 ORDER BY city;
```

---

### Q5 — Second Least Profitable Clinic per State (Given Month)

```sql
WITH clinic_profit AS (
    SELECT cl.cid, cl.clinic_name, cl.state,
        COALESCE(SUM(cs.amount), 0) - COALESCE(SUM(ex.amount), 0) AS profit
    FROM clinics cl
    LEFT JOIN clinic_sales cs ON cl.cid = cs.cid
        AND YEAR(cs.datetime) = :year AND MONTH(cs.datetime) = :month
    LEFT JOIN expenses ex ON cl.cid = ex.cid
        AND YEAR(ex.datetime) = :year AND MONTH(ex.datetime) = :month
    GROUP BY cl.cid, cl.clinic_name, cl.state
),
ranked AS (
    SELECT *, DENSE_RANK() OVER (PARTITION BY state ORDER BY profit ASC) AS rnk
    FROM clinic_profit
)
SELECT state, cid, clinic_name, profit FROM ranked WHERE rnk = 2 ORDER BY state;
```

**Approach:** `ORDER BY profit ASC` + `DENSE_RANK()` — rank 1 = least profitable, rank 2 = second least. `DENSE_RANK` avoids skipping rank 2 when ties exist at rank 1.

---

## Section C — Spreadsheet Proficiency

### Schema

| Sheet | Columns |
|-------|---------|
| ticket | ticket_id, created_at, closed_at, outlet_id, cms_id |
| feedbacks | cms_id, feedback_at, feedback_rating, **ticket_created_at** (to fill) |

---

### Q1 — Populate `ticket_created_at` in feedbacks

In the `feedbacks` sheet, column D (`ticket_created_at`):

```excel
=IFERROR(INDEX(ticket!$B:$B, MATCH(A2, ticket!$E:$E, 0)), "")
```

- `A2` = `cms_id` in feedbacks sheet (lookup key)
- `ticket!$E:$E` = `cms_id` column in ticket sheet
- `ticket!$B:$B` = `created_at` column in ticket sheet
- `IFERROR` returns blank for unmatched IDs (instead of `#N/A`)
- Drag formula down for all rows

**Why INDEX/MATCH over VLOOKUP?** INDEX/MATCH can look left, handles column insertions without breaking, and is more performant on large ranges.

---

### Q2a — Outlet-wise count: created AND closed on same day

**Helper column** in ticket sheet (col F):
```excel
=IF(INT(B2)=INT(C2), 1, 0)
```

**Summary SUMPRODUCT** (in a summary sheet):
```excel
=SUMPRODUCT(
  (ticket!$D:$D = [outlet_id]) *
  (INT(ticket!$B:$B) = INT(ticket!$C:$C))
)
```

- `INT()` strips the time portion from datetime — comparing dates only
- `SUMPRODUCT` multiplies boolean arrays: 1×1 = 1 only when both conditions are true

---

### Q2b — Outlet-wise count: created AND closed in same HOUR of same day

**Helper column** in ticket sheet (col G):
```excel
=IF(AND(INT(B2)=INT(C2), HOUR(B2)=HOUR(C2)), 1, 0)
```

**Summary SUMPRODUCT**:
```excel
=SUMPRODUCT(
  (ticket!$D:$D = [outlet_id]) *
  (INT(ticket!$B:$B) = INT(ticket!$C:$C)) *
  (HOUR(ticket!$B:$B) = HOUR(ticket!$C:$C))
)
```

- `HOUR()` extracts the 0–23 hour from a datetime
- All three conditions must be TRUE for a ticket to count

---

## Section D — Python Proficiency

### Q1 — Convert Minutes to Human-Readable Format

```python
def minutes_to_human_readable(minutes):
    if minutes < 0:
        return "Invalid input"
    hours = minutes // 60
    mins  = minutes % 60
    if hours == 0:
        return f"{mins} minutes"
    elif mins == 0:
        return f"{hours} hr"
    else:
        return f"{hours} hr {mins} minutes"

# Test
print(minutes_to_human_readable(130))  # → 2 hr 10 minutes
print(minutes_to_human_readable(110))  # → 1 hr 50 minutes
print(minutes_to_human_readable(60))   # → 1 hr
print(minutes_to_human_readable(45))   # → 45 minutes
```

**Logic:** Integer division `//` yields hours, modulo `%` yields remaining minutes. Three conditional branches cover all cases.

---

### Q2 — Remove Duplicate Characters (Using Loop)

```python
def remove_duplicates(s):
    seen   = []
    result = []
    for char in s:
        if char not in seen:
            seen.append(char)
            result.append(char)
    return ''.join(result)

# Test
print(remove_duplicates("hello"))        # → helo
print(remove_duplicates("programming"))  # → progamin
print(remove_duplicates("aabbcc"))       # → abc
```

**Logic:** Iterates the string with a `for` loop. Maintains a `seen` list to track visited characters. Only appends to result if not yet seen. Preserves original order of first occurrence.

---

## How to Run

### SQL Queries

```bash
# MySQL / MariaDB
mysql -u root -p your_database < sql/hotel_management/q1_last_booked_room.sql

# PostgreSQL
psql -d your_database -f sql/clinic_management/q3_monthly_pnl.sql
```

> Replace `:year` and `:month` placeholders with actual values before running parameterized queries.

### Python Scripts

```bash
# Requires Python 3.6+
python python/minutes_converter.py
python python/remove_duplicates.py
```

### Spreadsheet

Open `solutions/PlatinumRx_Assignment_Solutions.xlsx` in Microsoft Excel or Google Sheets (File → Import).

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| SQL | MySQL 8.0 / PostgreSQL 14 | Query writing & analysis |
| Python | 3.8+ | Scripting & logic |
| Microsoft Excel / Google Sheets | Any modern version | Spreadsheet formulas |

---

## Key SQL Concepts Used

| Concept | Used In |
|---------|---------|
| `ROW_NUMBER()` | Hotel Q1 — latest booking per user |
| `RANK()` | Hotel Q4 — most/least ordered items |
| `DENSE_RANK()` | Hotel Q5, Clinic Q4/Q5 — second highest/least |
| CTE (`WITH`) | Hotel Q4/Q5, Clinic Q3/Q4/Q5 |
| `HAVING` | Hotel Q3 — filter aggregated bill amounts |
| `FULL OUTER JOIN` | Clinic Q3 — all months even with missing data |
| `COALESCE` | Clinic Q3/Q4/Q5 — handle NULL joins |
| Window `PARTITION BY` | All ranking queries |

---

*Solutions prepared for the PlatinumRx Data Analyst Assignment.*
