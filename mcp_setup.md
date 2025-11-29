# Postgres MCP Server Setup

To allow your AI assistant (Claude, Cursor, etc.) to interact with the database, you need to configure the `postgres-mcp` server.

## Database Connection Details

I have verified connectivity to the following database:

- **Host**: `data.itak.live`
- **Port**: `5432`
- **Database**: `game_db`
- **User**: `game_user`
- **Password**: `slick132`

**Connection URI**:
```
postgresql://game_user:slick132@data.itak.live:5432/game_db
```

## Installation (Docker)

We recommend using Docker to run the MCP server.

### 1. Pull the Image
```bash
docker pull crystaldba/postgres-mcp
```

### 2. Configure Your Client

Add the following configuration to your MCP settings file (e.g., `claude_desktop_config.json` or Cursor MCP settings).

```json
{
  "mcpServers": {
    "postgres-game": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "DATABASE_URI",
        "crystaldba/postgres-mcp",
        "--access-mode=unrestricted"
      ],
      "env": {
        "DATABASE_URI": "postgresql://game_user:slick132@data.itak.live:5432/game_db"
      }
    }
  }
}
```

> [!NOTE]
> If you prefer to use the local Docker database defined in `docker-compose.yml` instead of `data.itak.live`, change the `DATABASE_URI` to:
> `postgresql://game_user:slick132@host.docker.internal:5432/game_db`

## Local Database (Optional)

If you wish to run the database locally, I have created a `docker-compose.yml` file in the project root. You can start it with:

```bash
docker-compose up -d
```
