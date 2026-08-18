import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckSquare, Square, ArrowUpRight } from 'lucide-react'
import { format } from 'date-fns'
import { getSupabase } from '../../lib/supabase'
import { parseLocalDate } from '../../lib/dates'
import { useAuth } from '../../contexts/AuthContext'
import type { Task } from '../../lib/adminTypes'

export default function Tasks() {
  const { profile } = useAuth()
  const queryClient = useQueryClient()

  useEffect(() => {
    document.title = 'My Tasks · Confluence Colorado admin'
  }, [])

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['my-tasks', 'all', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return []
      const supabase = await getSupabase()
      const { data, error } = await supabase
        .from('tasks')
        .select('*, opportunity:opportunities(id, name, type_id)')
        .eq('assignee_id', profile.id)
        .order('due_date', { ascending: true, nullsFirst: false })
      if (error) throw error
      return data ?? []
    },
    enabled: !!profile?.id,
  })

  const toggle = useMutation({
    mutationFn: async (task: Task) => {
      const supabase = await getSupabase()
      const next = task.status === 'complete' ? 'not_started' : 'complete'
      const { error } = await supabase
        .from('tasks')
        .update({ status: next, updated_at: new Date().toISOString() })
        .eq('id', task.id)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-tasks'] }),
  })

  const open = tasks.filter((t) => t.status !== 'complete')
  const done = tasks.filter((t) => t.status === 'complete')

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="max-w-3xl p-4 sm:p-6 lg:p-8">
      <h1 className="mb-1 text-2xl font-bold text-cc-sage-ink">My Tasks</h1>
      <p className="mb-8 text-sm text-gray-400">Tasks assigned to you across all opportunities.</p>

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : tasks.length === 0 ? (
        <p className="text-sm text-gray-500">No tasks assigned to you.</p>
      ) : (
        <div className="space-y-8">
          {open.length > 0 && (
            <section>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.07em] text-gray-400">
                Open ({open.length})
              </h2>
              <ul className="space-y-2">
                {open.map((t) => (
                  <TaskRow key={t.id} task={t} today={today} onToggle={() => toggle.mutate(t)} />
                ))}
              </ul>
            </section>
          )}
          {done.length > 0 && (
            <section>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.07em] text-gray-400">
                Completed ({done.length})
              </h2>
              <ul className="space-y-2 opacity-60">
                {done.map((t) => (
                  <TaskRow key={t.id} task={t} today={today} onToggle={() => toggle.mutate(t)} />
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

function TaskRow({ task, today, onToggle }: { task: Task; today: Date; onToggle: () => void }) {
  const complete = task.status === 'complete'
  const overdue = !complete && task.due_date != null && parseLocalDate(task.due_date).getTime() < today.getTime()

  return (
    <li className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3">
      <button
        type="button"
        onClick={onToggle}
        aria-label={complete ? 'Mark incomplete' : 'Mark complete'}
        className="mt-0.5 shrink-0"
      >
        {complete ? (
          <CheckSquare size={18} className="text-cc-sage-ink" />
        ) : (
          <Square size={18} className="text-gray-300 hover:text-cc-sage-ink" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium ${complete ? 'text-gray-400 line-through' : 'text-navy'}`}>
          {task.title}
        </p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
          {task.opportunity && (
            <Link
              to={`/admin/opportunities/${task.opportunity.id}`}
              className="inline-flex items-center gap-0.5 text-river hover:underline"
            >
              {task.opportunity.name}
              <ArrowUpRight size={11} />
            </Link>
          )}
          {task.due_date && (
            <span className={overdue ? 'font-medium text-red-600' : ''}>
              Due {format(parseLocalDate(task.due_date), 'MMM d, yyyy')}
              {overdue ? ' · overdue' : ''}
            </span>
          )}
        </div>
      </div>
    </li>
  )
}
