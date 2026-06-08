import * as service from "../src/venue/venue.service";
import * as repo from "../src/venue/venue.repository";

jest.mock("../src/venue/venue.repository");

describe("venue.service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getVenue", () => {
    it("should return a venue when found", async () => {
      const mockVenue = { id: 1, name: "Test Venue", capacity: 100 };
      (repo.findById as jest.Mock).mockResolvedValue(mockVenue);

      const result = await service.getVenue(1);

      expect(result).toEqual(mockVenue);
      expect(repo.findById).toHaveBeenCalledWith(1);
    });

    it("should return null when venue not found", async () => {
      (repo.findById as jest.Mock).mockResolvedValue(null);

      const result = await service.getVenue(999);

      expect(result).toBeNull();
      expect(repo.findById).toHaveBeenCalledWith(999);
    });
  });
});
