export type StatusTier = "Shadow" | "Silhouette" | "Almost Known"

export interface Message {
  id: string
  from: "me" | "them"
  text: string
  ts: string
}

export interface Stranger {
  id: string
  nickname: string
  encounters: number
  status: StatusTier
  realName: string
  icebreaker: string
  color: string
  messages: Message[]
}

function getTier(n: number): StatusTier {
  if (n >= 30) return "Almost Known"
  if (n >= 15) return "Silhouette"
  return "Shadow"
}

export const STRANGERS: Stranger[] = [
  {
    id: "1",
    nickname: "Morning Coffee Ghost",
    encounters: 7,
    status: getTier(7),
    realName: "Alex Chen",
    icebreaker:
      "You both always arrive at the exact same time — maybe you're running on the same invisible schedule.",
    color: "#C49A3C",
    messages: [
      { id: "m1", from: "them", text: "hey", ts: "9:14" },
      { id: "m2", from: "me", text: "hi", ts: "9:15" },
      {
        id: "m3",
        from: "them",
        text: "weird that we keep ending up here at the same time",
        ts: "9:15",
      },
      { id: "m4", from: "me", text: "yeah. coincidence probably", ts: "9:16" },
      { id: "m5", from: "them", text: "probably", ts: "9:16" },
    ],
  },
  {
    id: "2",
    nickname: "Library Corner Specter",
    encounters: 19,
    status: getTier(19),
    realName: "Maya Osei",
    icebreaker:
      "You've shared 19 quiet hours in the same corner. That's already a kind of intimacy.",
    color: "#8B5CF6",
    messages: [
      { id: "m1", from: "them", text: "do you come here every tuesday?", ts: "2:03" },
      { id: "m2", from: "me", text: "most of them. you?", ts: "2:04" },
      { id: "m3", from: "them", text: "seems like it", ts: "2:04" },
      { id: "m4", from: "me", text: "good spot", ts: "2:05" },
      { id: "m5", from: "them", text: "yeah", ts: "2:06" },
      { id: "m6", from: "them", text: "very good spot", ts: "2:06" },
    ],
  },
  {
    id: "3",
    nickname: "Rainy Platform Shade",
    encounters: 34,
    status: getTier(34),
    realName: "Jordan Park",
    icebreaker:
      "You've waited for the same train more times than some friends have met for coffee.",
    color: "#C084FC",
    messages: [
      { id: "m1", from: "them", text: "delayed again", ts: "8:31" },
      { id: "m2", from: "me", text: "of course", ts: "8:32" },
      { id: "m3", from: "them", text: "you take this line every day?", ts: "8:32" },
      { id: "m4", from: "me", text: "every single day. two years.", ts: "8:33" },
      { id: "m5", from: "them", text: "same.", ts: "8:33" },
      { id: "m6", from: "me", text: "how have we never actually talked", ts: "8:34" },
      { id: "m7", from: "them", text: "we're talking now", ts: "8:34" },
    ],
  },
]

export const STATUS_LABEL: Record<StatusTier, string> = {
  Shadow: "Shadow",
  Silhouette: "Silhouette",
  "Almost Known": "Almost Known",
}

export const TIER_THRESHOLD: Record<StatusTier, number> = {
  Shadow: 5,
  Silhouette: 15,
  "Almost Known": 30,
}
