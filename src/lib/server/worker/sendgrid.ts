import mail from '@sendgrid/mail';
import { config } from 'dotenv';

config();

mail.setApiKey(process.env.SENDGRID_API_KEY!);

export const Messages = {
	invite: (to: string, invitedBy: string, inviteId: string) => ({
		from: process.env.SENDGRID_SENDER!,
		to,
		subject: 'You have been invited to a list!',
		html: `
      You have been invited to a list by ${invitedBy}!
      <a href="http://localhost:5174/invite/${inviteId}">Click here to accept the invitation</a>
      `
	})
};

export default mail;
