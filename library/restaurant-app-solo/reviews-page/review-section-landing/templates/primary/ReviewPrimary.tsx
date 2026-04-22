import type { ReviewContent } from '../../types/schema';
import ReviewScrollingColumns from '../scrolling-columns/ReviewScrollingColumns';

export default function ReviewPrimary(props: ReviewContent) {
  return <ReviewScrollingColumns {...props} />;
}
