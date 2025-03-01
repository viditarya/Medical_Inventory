from datetime import datetime, timedelta

def is_near_expiry(expiry_date: datetime, threshold_days: int = 90) -> bool:
    """Check if a medicine batch is near expiry."""
    return (expiry_date - datetime.now()).days <= threshold_days

def calculate_reorder_point(average_daily_usage: float, lead_time_days: int, safety_stock: int) -> int:
    """Calculate reorder point for inventory management."""
    return int((average_daily_usage * lead_time_days) + safety_stock)

def format_batch_number(medicine_id: int, batch_sequence: int) -> str:
    """Generate a formatted batch number."""
    return f"BATCH-{medicine_id:04d}-{batch_sequence:04d}"