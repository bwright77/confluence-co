// Types for the OMP admin platform (grant seeking + governance), ported from
// wright-adventures. Kept separate from the marketing site's content types.

export type UserRole = 'admin' | 'manager' | 'member' | 'viewer'

export interface Profile {
  id: string
  full_name: string
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
}

// ---------------------------------------------------------------------------
// Board meeting minutes (Phase 2). Transcript → AI extraction → review → approval.
// ---------------------------------------------------------------------------
export type BoardMeetingStatus = 'draft' | 'under_review' | 'approved'
export type ExtractionStatus = 'pending' | 'processing' | 'complete' | 'failed'

export interface BoardMeetingReport {
  title: string
  presenter: string
  summary: string
  action_required: boolean
}

export interface BoardMeetingVote {
  yes: number | null
  no: number | null
  abstain: number | null
  result: string // e.g. "PASSED", "FAILED", "PASSED (unanimous)"
}

export interface BoardMeetingMotion {
  id: string // e.g. "M-001"
  description: string
  moved_by: string
  seconded_by: string
  discussion_summary: string
  vote: BoardMeetingVote
}

export interface BoardMeetingActionItem {
  description: string
  assigned_to: string
  due_date: string | null
}

export interface BoardMeetingExtractedData {
  meeting_info: {
    date: string
    start_time: string | null
    end_time: string | null
    location: string
    called_to_order_by: string | null
  }
  attendance: {
    directors_present: string[]
    directors_absent: string[]
    guests: string[]
    quorum_met: boolean | null
    quorum_note: string | null
  }
  prior_minutes: {
    reviewed: boolean
    approved: boolean
    corrections: string | null
  }
  reports: BoardMeetingReport[]
  motions: BoardMeetingMotion[]
  action_items: BoardMeetingActionItem[]
  next_meeting: {
    date: string | null
    time: string | null
    location: string | null
  }
  adjournment_time: string | null
  ai_flags: string[]
  ai_flags_dismissed?: Array<{
    flag: string
    dismissed_by: string
    dismissed_at: string
  }>
}

export interface BoardMeeting {
  id: string
  meeting_date: string
  meeting_start: string | null
  meeting_end: string | null
  location: string
  transcript_file_path: string | null
  transcript_raw: string | null
  extracted_data: BoardMeetingExtractedData | null
  extraction_status: ExtractionStatus
  extraction_error: string | null
  edited_data: BoardMeetingExtractedData | null
  status: BoardMeetingStatus
  approved_by: string | null
  approved_at: string | null
  created_by: string
  created_at: string
  updated_at: string
  // Joined (optional)
  approver?: Profile
  creator?: Profile
}
