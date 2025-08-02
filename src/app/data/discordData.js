import {
  Gamepad2,
  BookOpen,
  Music,
  Palette,
  Monitor,
  UserPlus,
  Settings,
  Bell,
  LogOut,
  Users,
  FileText,
  Pin,
  MessageSquare,
  Link,
} from "lucide-react"

export const servers = [
  { id: 1, name: "Gaming Hub", icon: Gamepad2, color: "#5865f2" },
  { id: 2, name: "Study Group", icon: BookOpen, color: "#57f287" },
  { id: 3, name: "Music Lovers", icon: Music, color: "#fee75c" },
  { id: 4, name: "Art Community", icon: Palette, color: "#eb459e" },
  { id: 5, name: "Tech Talk", icon: Monitor, color: "#00d4aa" },
]

export const channels = {
  text: [
    { id: "chung", name: "chung" },
    { id: "rule-of-code", name: "rule-of-code" },
    { id: "theory-and-lecture", name: "theory-and-lecture" },
    { id: "objective", name: "objective" },
  ],
  voice: [{ id: "phong-hoc-1", name: "Phòng Học 1" }],
}

export const members = {
  online: [
    { id: 1, name: "Owner", initials: "OW", status: "online", color: "#99aab5", isOwner: true },
    { id: 2, name: "Thành Phúc", initials: "TP", status: "online", color: "#5865f2" },
  ],
  offline: [],
}

export const memberTabs = [
  { id: "Members", label: "Members", icon: Users },
  { id: "Media", label: "Media", icon: FileText },
  { id: "Pins", label: "Pins", icon: Pin },
  { id: "Threads", label: "Threads", icon: MessageSquare },
  { id: "Links", label: "Links", icon: Link },
  { id: "Files", label: "Files", icon: FileText },
]

export const serverMenuItems = [
  { id: "invite", label: "Invite People", icon: UserPlus, color: "normal" },
  { id: "settings", label: "Server Settings", icon: Settings, color: "normal" },
  { id: "notifications", label: "Notification Settings", icon: Bell, color: "normal" },
  { id: "leave", label: "Leave Server", icon: LogOut, color: "danger" },
]

export const muteOptions = [
  "For 15 Minutes",
  "For 1 Hour",
  "For 3 Hours",
  "For 8 Hours",
  "For 24 Hours",
  "Until I turn it back on",
]
