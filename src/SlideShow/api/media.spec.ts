import importedAxios from "axios";
import { MockedObject } from "vitest";
import { getMedia, Media } from "./media";

vitest.mock("axios", () => {
  return {
    default: {
      request: vitest.fn(),
    },
  };
});

const axios = importedAxios as unknown as MockedObject<typeof importedAxios>;

// Sample Media to use during tests
const sampleMedia: Media = {
  id: "123",
  urls: {
    raw: "",
    small: "",
    thumb: "",
    regular: "",
    small_s3: "",
  },
};

describe("media", () => {
  afterEach(() => {
    vitest.resetAllMocks();
  });

  it("returns media object when successful", async () => {
    // Setup
    axios.request.mockResolvedValueOnce({
      data: { success: true, response: { media: sampleMedia } },
    });

    // Act
    const result = await getMedia("1");

    // Assert
    expect(result).toEqual(sampleMedia);
    expect(axios.request).toHaveBeenCalledTimes(1);
    expect(axios.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "/.netlify/functions/media?media-id=1",
      })
    );
  });

  it("retries when request fails", async () => {
    // Setup
    axios.request
      .mockRejectedValueOnce("Error")
      .mockRejectedValueOnce("Error")
      .mockResolvedValueOnce({
        data: { success: true, response: { media: sampleMedia } },
      });

    // Act
    const result = await getMedia("2");

    // Assert
    expect(result).toEqual(sampleMedia);
    expect(axios.request).toHaveBeenCalledTimes(3);
  });

  it("throws an error when request fails continuously", async () => {
    // Setup
    axios.request.mockRejectedValue("Error");

    // Act & Assert
    await expect(getMedia("3", 2)).rejects.toThrow("can't find media 3");
    expect(axios.request).toHaveBeenCalledTimes(3);
  });

  it("throws an error when request returns an unsuccessful response", async () => {
    // Setup
    axios.request.mockResolvedValueOnce({
      data: { success: false, response: { media: {} } },
    });

    // Act & Assert
    await expect(getMedia("123", 0)).rejects.toThrow();
  });
});
