import { supabaseAdmin } from '@/lib/supabase/admin';
import { setReviewerAction } from '../actions';

export default async function MembersPage() {
  const { data } = await supabaseAdmin().from('users').select('id, email, display_name, role, is_reviewer, created_at').order('created_at', { ascending: false });
  const users = data ?? [];
  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-[32px] font-semibold'>Members</h1>
        <p className='max-w-2xl text-[15px] font-semibold text-mist'>
          Everyone who has signed up. Tick <strong>Reviewer</strong> for friends and partners — they can read every book in full, including unlisted drafts, free for life. Admins are set in Clerk (Public metadata → role: admin).
        </p>
      </div>
      <div className='overflow-hidden rounded-[20px] border border-[#e3e9f2] bg-white'>
        <table className='w-full text-[15px]'>
          <thead className='bg-[#f4f6fa] text-left text-xs font-bold uppercase tracking-wider text-mist'>
            <tr>
              <th className='px-5 py-3'>Member</th>
              <th className='px-5 py-3'>Joined</th>
              <th className='px-5 py-3'>Access</th>
              <th className='px-5 py-3'>Reviewer</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className='border-t border-[#e3e9f2]'>
                <td className='px-5 py-3'>
                  <div className='font-bold text-royal'>{u.display_name ?? '—'}</div>
                  <div className='text-xs font-semibold text-mist'>{u.email ?? 'no email'}</div>
                </td>
                <td className='px-5 py-3 font-semibold text-slate'>{new Date(u.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td className='px-5 py-3'>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${u.role === 'admin' ? 'bg-[#fff1db] text-[#b85e00]' : u.is_reviewer ? 'bg-sun/30 text-[#8a6100]' : 'bg-[#eef2f7] text-mist'}`}>
                    {u.role === 'admin' ? 'Admin' : u.is_reviewer ? 'Reviewer' : 'Member'}
                  </span>
                </td>
                <td className='px-5 py-3'>
                  <form action={setReviewerAction.bind(null, u.id, !u.is_reviewer)}>
                    <button className={`rounded-lg px-3 py-1.5 text-[13px] font-bold ${u.is_reviewer ? 'border-2 border-line text-slate hover:border-coral hover:text-coral' : 'bg-ocean text-white hover:bg-royal'}`}>
                      {u.is_reviewer ? 'Remove' : 'Make reviewer'}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className='p-8 text-center text-sm font-bold text-mist'>No members yet.</p>}
      </div>
    </div>
  );
}
