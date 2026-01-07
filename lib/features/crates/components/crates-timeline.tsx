interface CratesTimelineProps {
  userId?: string;
}
export default function CratesTimeline(props: CratesTimelineProps) {
  return <div>Crates Timeline for user {props.userId}</div>;
}
