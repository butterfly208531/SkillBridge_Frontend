const LeftPanel = () => {
  return (
    <div
      className='hidden lg:flex lg:w-5/12 flex-col justify-between relative overflow-hidden'
      style={{ background: 'linear-gradient(160deg, #2196F3 0%, #1565C0 50%, #0D47A1 100%)' }}
    >
      {/* Background globe watermark */}
      <div className='absolute inset-0 flex items-center justify-center opacity-10'>
        <svg viewBox="0 0 200 200" className='w-96 h-96 text-white' fill='none' stroke='currentColor' strokeWidth='1'>
          <circle cx='100' cy='100' r='90' />
          <ellipse cx='100' cy='100' rx='45' ry='90' />
          <line x1='10' y1='100' x2='190' y2='100' />
          <path d='M 100 10 Q 150 50 150 100 Q 150 150 100 190' />
          <path d='M 100 10 Q 50 50 50 100 Q 50 150 100 190' />
        </svg>
      </div>

      {/* Top heading */}
      <div className='relative z-10 px-10 pt-14'>
        <h2 className='text-4xl font-black text-white leading-tight'>
          Apply for
          <br />
          <span className='text-[#F57C00]'>SkillBridge</span>
        </h2>
        <p className='text-white/70 text-sm mt-3 leading-relaxed'>
          Join hundreds of students who launched their careers with our bootcamps.
        </p>
      </div>

      {/* Fan of cards */}
      <div className='relative z-10 flex items-center justify-center flex-1 py-8'>
        <div className='relative w-72 h-48'>
          <div className='absolute left-0 top-4 w-28 h-36 rounded-2xl overflow-hidden shadow-xl rotate-[-18deg] origin-bottom'
            style={{ background: 'linear-gradient(135deg,#F57C00,#FF8F00)' }}>
            <div className='p-3 text-white'>
              <div className='text-[10px] font-bold uppercase tracking-wider opacity-80'>ERP</div>
              <div className='text-sm font-black mt-1'>Odoo Bootcamp</div>
            </div>
          </div>
          <div className='absolute left-8 top-2 w-28 h-36 rounded-2xl overflow-hidden shadow-xl rotate-[-9deg] origin-bottom bg-white'>
            <div className='p-3'>
              <div className='text-[10px] font-bold uppercase tracking-wider text-gray-400'>Dev</div>
              <div className='text-sm font-black mt-1 text-gray-800'>Full-Stack</div>
            </div>
          </div>
          <div className='absolute left-16 -top-2 w-32 h-40 rounded-2xl overflow-hidden shadow-2xl z-10'
            style={{ background: 'linear-gradient(135deg,#1565C0,#2196F3)' }}>
            <div className='p-4 text-white'>
              <div className='text-[10px] font-bold uppercase tracking-wider opacity-80'>2025</div>
              <div className='text-base font-black mt-1'>SkillBridge<br />Bootcamp</div>
            </div>
          </div>
          <div className='absolute right-8 top-2 w-28 h-36 rounded-2xl overflow-hidden shadow-xl rotate-[9deg] origin-bottom'
            style={{ background: 'linear-gradient(135deg,#00897B,#00BCD4)' }}>
            <div className='p-3 text-white'>
              <div className='text-[10px] font-bold uppercase tracking-wider opacity-80'>AI</div>
              <div className='text-sm font-black mt-1'>Machine Learning</div>
            </div>
          </div>
          <div className='absolute right-0 top-4 w-28 h-36 rounded-2xl overflow-hidden shadow-xl rotate-[18deg] origin-bottom'
            style={{ background: 'linear-gradient(135deg,#7B1FA2,#E91E63)' }}>
            <div className='p-3 text-white'>
              <div className='text-[10px] font-bold uppercase tracking-wider opacity-80'>IELTS</div>
              <div className='text-sm font-black mt-1'>Study Abroad</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom frosted info panel */}
      <div className='relative z-10 mx-6 mb-10 rounded-2xl p-5'
        style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.25)' }}>
        <ul className='space-y-2 mb-4'>
          {['Project-based learning', 'Expert mentorship', 'Career support & placement'].map((item) => (
            <li key={item} className='flex items-center gap-2 text-white/90 text-sm'>
              <span className='w-4 h-4 rounded-full border-2 border-white/60 flex items-center justify-center shrink-0'>
                <span className='w-1.5 h-1.5 rounded-full bg-white' />
              </span>
              {item}
            </li>
          ))}
        </ul>
        <div className='flex gap-2'>
          {['f', 't', 'in', 'yt'].map((s) => (
            <div key={s} className='w-6 h-6 rounded bg-white/20 flex items-center justify-center text-white text-[10px] font-bold'>{s}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
