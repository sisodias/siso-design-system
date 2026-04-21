import type { GuestFeedbackContent } from '../../types/schema';
import { GuestFeedbackClient } from './GuestFeedbackClient';

export default function GuestFeedbackPrimary(content: GuestFeedbackContent) {
  return <GuestFeedbackClient content={content} />;
}
