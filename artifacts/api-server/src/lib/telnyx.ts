import Telnyx from "telnyx";

const telnyxApiKey = process.env.TELNYX_API_KEY!;
const messagingProfileId = process.env.TELNYX_MESSAGING_PROFILE_ID!;

const telnyx = new Telnyx(telnyxApiKey);

export { telnyx, messagingProfileId };
