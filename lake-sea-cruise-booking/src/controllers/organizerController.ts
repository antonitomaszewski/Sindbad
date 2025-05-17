export class OrganizerController {
    constructor(private organizerService: OrganizerService) {}

    async createProfile(req, res) {
        try {
            const profileData = req.body;
            const newProfile = await this.organizerService.createProfile(profileData);
            res.status(201).json(newProfile);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async editProfile(req, res) {
        try {
            const profileId = req.params.id;
            const profileData = req.body;
            const updatedProfile = await this.organizerService.editProfile(profileId, profileData);
            res.status(200).json(updatedProfile);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getProfile(req, res) {
        try {
            const profileId = req.params.id;
            const profile = await this.organizerService.getProfile(profileId);
            res.status(200).json(profile);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}