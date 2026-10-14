# Fishtribution Database

## Overview

This directory contains the PostgreSQL database schema and sample data for Fishtribution, developed by Team (ill fill it with the finalized name).

The database is designed for Neon PostgreSQL and closely follows the project's Entity Relationship Diagram (ERD).

## Initial Database Structure

The first implementation contains four tables:

| Table | Description |
|---|---|
| `users` | User profiles and application roles |
| `user_settings` | User preferences and settings |
| `fish_taxa` | Fish species and taxnomic classifications |
| `catches` | Fishing catch records, measurements, and locations |

## Relationships

- Each user can have multiple catches.
- Each user can have one settings record.
- Each catch references a user and a fish taxon.
- One fish taxon can be associated with multiple catches.

## Database Files

**migrations/001_initial_schema.sql**

Creates the initial PostgreSQL tables, constraints, relationships, and indexes.

**seeds/001_sample_data.sql**

Contains testing sample to use for development and testing.

## Future Development

Features may require tables for fishing sites, catch photographs, site proposals, and notifications.

These additions will be handled through future schema migrations.

## Deployment

Database migrations MUST be reviewed and tested before being applied to Neon.

The seed data is ONLY for development and testing only and should NOT be applied to production.

The application's database connection is configured through the `DATABASE_URL` environment variable. Database credentials MUST NEVER be committed to GitHub.