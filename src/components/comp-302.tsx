import { ArrowRightIcon } from "lucide-react";

export default function AnnouncementBanner() {
	return (
		<div className="dark bg-muted text-foreground px-4 py-3">
			<p className="flex justify-center text-sm">
				<button
					type="button"
					className="group bg-transparent border-none p-0 text-inherit underline cursor-pointer"
					onClick={() => {
						// TODO: Implement action for this announcement
						console.log("Announcement clicked");
					}}
				>
					<span className="me-1 text-base leading-none">✨</span>
					Introducing transactional and marketing emails
					<ArrowRightIcon
						className="ms-2 -mt-0.5 inline-flex opacity-60 transition-transform group-hover:translate-x-0.5"
						size={16}
						aria-hidden="true"
					/>
				</button>
			</p>
		</div>
	);
}
