from typing import TypeVar, Generic, List
from pydantic import BaseModel
from math import ceil

T = TypeVar('T')

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    per_page: int
    total_pages: int

def paginate(items: List[T], page: int = 1, per_page: int = 20) -> PaginatedResponse[T]:
    """
    Paginate a list of items.
    
    Args:
        items: Full list of items
        page: Current page number (1-indexed)
        per_page: Number of items per page (max 100)
    
    Returns:
        PaginatedResponse with metadata
    """
    # Enforce limits
    per_page = min(per_page, 100)  # Max 100 items per page
    page = max(page, 1)  # Minimum page 1
    
    total = len(items)
    total_pages = ceil(total / per_page) if total > 0 else 1
    
    # Calculate slice boundaries
    start = (page - 1) * per_page
    end = start + per_page
    
    return PaginatedResponse(
        items=items[start:end],
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages
    )
