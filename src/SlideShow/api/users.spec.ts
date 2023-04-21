import axios from "axios";
import { getUser, User } from "./users";

describe("getUser", () => {
  it("returns a user object if the request succeeds", async () => {
    // Arrange
    const expected: User = {
      id: "abc123",
      username: "testuser",
      first_name: "Test",
      last_name: "User",
      profile_images: {
        small: "http://example.com/small.jpg",
        medium: "http://example.com/medium.jpg",
        large: "http://example.com/large.jpg",
      },
    };
    vi.spyOn(axios, "request").mockResolvedValue({
      data: { success: true, response: { user: expected } },
    });

    // Act
    const result = await getUser("testuser");

    // Assert
    expect(result).toEqual(expected);
  });

  it("throws an error if the request fails", async () => {
    // Arrange
    vi.spyOn(axios, "request").mockResolvedValue({
      data: { success: false, message: "User not found" },
    });

    // Act/Assert
    await expect(getUser("newuser")).rejects.toThrow();
  });
});
