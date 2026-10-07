import { render, screen } from "@testing-library/react";
import MemberCard from "./MemberCard";

test("メンバーの情報が表示される", () => {
    const testMember = {
        id: 1,
        name: "ひろし",
        avatar_path: "test.png",
        success_score:2,
        current_animal: {
            id: 2,
            name: "りす",
            avatar_path:"testAnimal.png"
        },
    }

    const testLevel = 2;

    render(<MemberCard member={testMember} level={ testLevel} showButton={true} success={testMember.success_score} />)

    expect(screen.getByText("ひろし")
    ).toBeInTheDocument();

    const image = screen.getByRole("img", {
        name: "ひろし"
    });

    const animalImage = screen.getByRole("img", {
        name:"りす",
    })

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "test.png");
    expect(animalImage).toHaveAttribute("src", "testAnimal.png");

    expect(screen.getByText("Lv. 2")).toBeInTheDocument();
})