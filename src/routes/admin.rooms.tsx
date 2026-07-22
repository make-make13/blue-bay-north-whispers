import { createFileRoute } from "@tanstack/react-router";
import { StaysAdminPage } from "../components/admin/StaysAdminPage";

export const Route = createFileRoute("/admin/rooms")({
  component: () => <StaysAdminPage kind="townhouse" />,
});
