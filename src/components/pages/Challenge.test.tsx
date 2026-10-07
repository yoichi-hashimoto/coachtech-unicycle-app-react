import { render, screen } from "@testing-library/react"
import HistoryCard from "../common/cards/HistoryCard"

test("チャレンジ結果が表示される", () => {
    
    const challenge = {
        id: 1,
        user_id: 1,
        skill_name:"アイドリング",
        success_score: 3,
        created_at:"2026-10-06T07:30:00.000Z",
    }

    render(<HistoryCard history={challenge} />)
    
    expect(screen.getByText(/アイドリング/)).toBeInTheDocument()
})