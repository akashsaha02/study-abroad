import { LoadingState } from "@/components/common/LoadingState";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-8">
      <LoadingState rows={4} />
    </div>
  );
}
