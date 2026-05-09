"""initial schema

Revision ID: 0001_initial
Revises:
Create Date: 2026-05-09
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0001_initial"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto")
    op.create_table(
        "rumbles",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("task", sa.Text(), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("selected_ais", postgresql.JSONB(), nullable=False),
        sa.Column("winner_ai", sa.String(length=50)),
        sa.Column("total_votes", sa.Integer(), server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("completed_at", sa.DateTime(timezone=True)),
        sa.Column("ip_hash", sa.String(length=64)),
    )
    op.create_table(
        "ai_models",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("name", sa.String(length=50), nullable=False, unique=True),
        sa.Column("display_name", sa.String(length=100), nullable=False),
        sa.Column("provider", sa.String(length=50), nullable=False),
        sa.Column("model_string", sa.String(length=100), nullable=False),
        sa.Column("personality", sa.Text(), nullable=False),
        sa.Column("tagline", sa.String(length=200), nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default=sa.true()),
        sa.Column("max_tokens", sa.Integer(), server_default="300"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_ai_models_name", "ai_models", ["name"])
    op.create_table(
        "rounds",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("rumble_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("rumbles.id", ondelete="CASCADE")),
        sa.Column("round_type", sa.String(length=10), nullable=False),
        sa.Column("round_number", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("started_at", sa.DateTime(timezone=True)),
        sa.Column("completed_at", sa.DateTime(timezone=True)),
    )
    op.create_table(
        "arguments",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("rumble_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("rumbles.id", ondelete="CASCADE")),
        sa.Column("round_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("rounds.id", ondelete="CASCADE")),
        sa.Column("ai_name", sa.String(length=50), nullable=False),
        sa.Column("argument_type", sa.String(length=20), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("target_ai", sa.String(length=50)),
        sa.Column("token_count", sa.Integer()),
        sa.Column("latency_ms", sa.Integer()),
        sa.Column("phase_order", sa.Integer()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_table(
        "votes",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("rumble_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("rumbles.id", ondelete="CASCADE")),
        sa.Column("voted_ai", sa.String(length=50), nullable=False),
        sa.Column("ip_hash", sa.String(length=64), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.UniqueConstraint("rumble_id", "ip_hash", name="uq_vote_rumble_ip_hash"),
    )


def downgrade() -> None:
    op.drop_table("votes")
    op.drop_table("arguments")
    op.drop_table("rounds")
    op.drop_index("ix_ai_models_name", table_name="ai_models")
    op.drop_table("ai_models")
    op.drop_table("rumbles")
