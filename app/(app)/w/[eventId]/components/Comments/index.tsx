import CommentInput from "./CommentInput";
export default function CommentSection() {
  return (
    <section className="space-y-2.5 py-2">
      {/* Comments Section */}
      <div className="">
        <div className="flex items-center">
          <h2 className="text-base font-semibold text-foreground">
            123 Comments
          </h2>
        </div>
      </div>
      <CommentInput />
    </section>
  );
}
