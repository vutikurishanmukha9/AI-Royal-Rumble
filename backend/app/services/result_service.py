from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.ai_model import AIModel
from app.models.rumble import Argument, Rumble, Vote


async def get_vote_counts(session: AsyncSession, rumble_id) -> dict[str, int]:
    rows = await session.execute(
        select(Vote.voted_ai, func.count(Vote.id)).where(Vote.rumble_id == rumble_id).group_by(Vote.voted_ai)
    )
    return {name: count for name, count in rows.all()}


async def complete_rumble(session: AsyncSession, rumble: Rumble) -> Rumble:
    counts = await get_vote_counts(session, rumble.id)
    winner = max(counts.items(), key=lambda item: item[1])[0] if counts else None
    rumble.winner_ai = winner
    rumble.total_votes = sum(counts.values())
    rumble.status = "completed"
    await session.commit()
    await session.refresh(rumble)
    return rumble


async def build_results(session: AsyncSession, rumble: Rumble) -> dict:
    votes = await get_vote_counts(session, rumble.id)
    winner_model = None
    if rumble.winner_ai:
        winner_model = await session.scalar(select(AIModel).where(AIModel.name == rumble.winner_ai))
    args = await session.execute(select(Argument).where(Argument.rumble_id == rumble.id, Argument.argument_type == "pitch"))
    key_arguments = {arg.ai_name: arg.content[:180] for arg in args.scalars().all()}
    total = sum(votes.values())
    winner_votes = votes.get(rumble.winner_ai, 0) if rumble.winner_ai else 0
    return {
        "rumble_id": rumble.id,
        "task": rumble.task,
        "winner": rumble.winner_ai,
        "winner_display_name": winner_model.display_name if winner_model else None,
        "winner_tagline": winner_model.tagline if winner_model else None,
        "final_votes": votes,
        "total_votes": total,
        "winner_percentage": round((winner_votes / total) * 100, 1) if total else 0,
        "key_arguments": key_arguments,
        "completed_at": rumble.completed_at,
    }
