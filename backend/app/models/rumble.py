import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Rumble(Base):
    __tablename__ = "rumbles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    task: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="created")
    selected_ais: Mapped[list[str]] = mapped_column(JSONB, nullable=False)
    winner_ai: Mapped[str | None] = mapped_column(String(50))
    total_votes: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    ip_hash: Mapped[str | None] = mapped_column(String(64))

    rounds: Mapped[list["Round"]] = relationship(back_populates="rumble", cascade="all, delete-orphan")
    arguments: Mapped[list["Argument"]] = relationship(back_populates="rumble", cascade="all, delete-orphan")
    votes: Mapped[list["Vote"]] = relationship(back_populates="rumble", cascade="all, delete-orphan")


class Round(Base):
    __tablename__ = "rounds"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    rumble_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("rumbles.id", ondelete="CASCADE"))
    round_type: Mapped[str] = mapped_column(String(10), nullable=False)
    round_number: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    rumble: Mapped[Rumble] = relationship(back_populates="rounds")
    arguments: Mapped[list["Argument"]] = relationship(back_populates="round", cascade="all, delete-orphan")


class Argument(Base):
    __tablename__ = "arguments"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    rumble_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("rumbles.id", ondelete="CASCADE"))
    round_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("rounds.id", ondelete="CASCADE"))
    ai_name: Mapped[str] = mapped_column(String(50), nullable=False)
    argument_type: Mapped[str] = mapped_column(String(20), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    target_ai: Mapped[str | None] = mapped_column(String(50))
    token_count: Mapped[int | None] = mapped_column(Integer)
    latency_ms: Mapped[int | None] = mapped_column(Integer)
    phase_order: Mapped[int | None] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    rumble: Mapped[Rumble] = relationship(back_populates="arguments")
    round: Mapped[Round] = relationship(back_populates="arguments")


class Vote(Base):
    __tablename__ = "votes"
    __table_args__ = (UniqueConstraint("rumble_id", "ip_hash", name="uq_vote_rumble_ip_hash"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    rumble_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("rumbles.id", ondelete="CASCADE"))
    voted_ai: Mapped[str] = mapped_column(String(50), nullable=False)
    ip_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    rumble: Mapped[Rumble] = relationship(back_populates="votes")
