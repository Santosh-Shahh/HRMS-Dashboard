import {TrendingUp,Fingerprint,CalendarMinus,Wallet,UsersRound} from 'lucide-react';
export default function KPICards(){return <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 delay-100">{[
['Total Headcount','1,248','+12 new hires this month',<UsersRound/>],
["Today's Attendance",'985 / 1,224','12 Absent • 45 Late',<Fingerprint/>],
['Leave Requests','24 On Leave','8 Requires Approval',<CalendarMinus/>],
['Payroll Cycle (Jul)','Processing','Step 4 of 5: Bank Verification • 94%',<Wallet/>]
].map((c,i)=><div key={c[0] as string} className="bg-white rounded-xl p-5 shadow-sm border"><div className="flex justify-between"><div><h3 className="text-slate-500 text-sm font-semibold uppercase">{c[0]}</h3><p className="text-2xl font-bold mt-2">{c[1]}</p></div><div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">{c[3]}</div></div><p className="text-xs text-slate-500 mt-3">{c[2]}</p>{i===3&&<div className="mt-3 h-2 bg-slate-100 rounded"><div className="h-full w-[94%] bg-purple-500 rounded"/></div>}</div>)}</div>}