export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  agentId: string;
  title: string;
  messages: ChatMessage[];
  lastUpdated: string;
}

export const chatSessions: Record<string, ChatSession[]> = {
  '1': [
    {
      id: 'c1-1',
      agentId: '1',
      title: 'Pitch deck feedback',
      lastUpdated: '2 hours ago',
      messages: [
        { id: 'm1', role: 'user', content: 'I need help with my pitch deck for our Series A.', timestamp: '10:30 AM' },
        { id: 'm2', role: 'assistant', content: 'I\'d be happy to help! What stage is your company at currently, and what\'s your primary market?', timestamp: '10:31 AM' },
        { id: 'm3', role: 'user', content: 'We\'re a B2B SaaS in the HR tech space. 50 customers, $200k ARR.', timestamp: '10:32 AM' },
        { id: 'm4', role: 'assistant', content: 'Great traction! For Series A, investors will want to see a clear path to $1M+ ARR. Let\'s structure your deck around your growth metrics and expansion strategy.', timestamp: '10:33 AM' },
        { id: 'm5', role: 'user', content: 'Should I lead with the problem or the traction?', timestamp: '10:35 AM' },
        { id: 'm6', role: 'assistant', content: 'Lead with traction. At your stage, numbers speak louder. Open with your ARR growth chart, then context on the problem you\'re solving.', timestamp: '10:36 AM' },
      ],
    },
    {
      id: 'c1-2',
      agentId: '1',
      title: 'Hiring strategy',
      lastUpdated: 'Yesterday',
      messages: [
        { id: 'm1', role: 'user', content: 'When should I hire my first sales rep?', timestamp: '3:00 PM' },
        { id: 'm2', role: 'assistant', content: 'Once you as a founder have closed at least 10-20 deals yourself. You need to understand the sales motion before delegating it.', timestamp: '3:01 PM' },
      ],
    },
  ],
  '2': [
    {
      id: 'c2-1',
      agentId: '2',
      title: 'React performance review',
      lastUpdated: '1 hour ago',
      messages: [
        { id: 'm1', role: 'user', content: 'Can you review this React component for performance issues?', timestamp: '2:00 PM' },
        { id: 'm2', role: 'assistant', content: 'Please share the component code and I\'ll analyze it for common performance pitfalls.', timestamp: '2:01 PM' },
        { id: 'm3', role: 'user', content: 'It\'s a data table with 1000+ rows that re-renders on every keystroke.', timestamp: '2:02 PM' },
        { id: 'm4', role: 'assistant', content: 'Classic issue. You\'ll want to implement virtualization with react-window, and debounce your search input. Also, wrap your row components in React.memo().', timestamp: '2:03 PM' },
        { id: 'm5', role: 'user', content: 'What about useMemo for the filtered data?', timestamp: '2:05 PM' },
        { id: 'm6', role: 'assistant', content: 'Yes, definitely memoize the filtered results. But more importantly, move the filtering logic to a web worker if you\'re processing large datasets.', timestamp: '2:06 PM' },
        { id: 'm7', role: 'user', content: 'Thanks! This helped a lot.', timestamp: '2:10 PM' },
        { id: 'm8', role: 'assistant', content: 'Happy to help! Remember to profile with React DevTools to measure the actual impact of these optimizations.', timestamp: '2:11 PM' },
      ],
    },
  ],
  '3': [
    {
      id: 'c3-1',
      agentId: '3',
      title: 'NDA review',
      lastUpdated: '3 hours ago',
      messages: [
        { id: 'm1', role: 'user', content: 'A potential partner sent over an NDA. Can you review it?', timestamp: '9:00 AM' },
        { id: 'm2', role: 'assistant', content: 'I can help analyze the key terms. Please share the document or paste the relevant clauses.', timestamp: '9:01 AM' },
        { id: 'm3', role: 'user', content: 'The term is 5 years with a non-compete clause.', timestamp: '9:03 AM' },
        { id: 'm4', role: 'assistant', content: 'That\'s quite long. Standard NDAs are typically 2-3 years. The non-compete is concerning—those are often unenforceable and could limit your business operations.', timestamp: '9:04 AM' },
        { id: 'm5', role: 'user', content: 'Should I push back?', timestamp: '9:06 AM' },
        { id: 'm6', role: 'assistant', content: 'Yes. Propose a 2-year term and request removal of the non-compete, or at minimum, narrow its scope significantly.', timestamp: '9:07 AM' },
      ],
    },
  ],
  '4': [
    {
      id: 'c4-1',
      agentId: '4',
      title: 'Calculus exam prep',
      lastUpdated: '30 min ago',
      messages: [
        { id: 'm1', role: 'user', content: 'I have a calculus exam tomorrow and I\'m struggling with integration by parts.', timestamp: '4:00 PM' },
        { id: 'm2', role: 'assistant', content: 'No worries! Let\'s break it down. The formula is ∫u dv = uv - ∫v du. The trick is choosing what to make u and dv.', timestamp: '4:01 PM' },
        { id: 'm3', role: 'user', content: 'How do I decide which is u?', timestamp: '4:02 PM' },
        { id: 'm4', role: 'assistant', content: 'Use LIATE: Logs, Inverse trig, Algebraic, Trig, Exponential. Pick u from whichever comes first in this list.', timestamp: '4:03 PM' },
        { id: 'm5', role: 'user', content: 'Can we try an example? ∫x·eˣ dx', timestamp: '4:05 PM' },
        { id: 'm6', role: 'assistant', content: 'Perfect example! x is algebraic (A), eˣ is exponential (E). A comes before E in LIATE, so u = x. Therefore dv = eˣ dx, v = eˣ, and du = dx.', timestamp: '4:06 PM' },
        { id: 'm7', role: 'user', content: 'So the answer is x·eˣ - eˣ + C?', timestamp: '4:08 PM' },
        { id: 'm8', role: 'assistant', content: 'Exactly right! You can factor it as eˣ(x - 1) + C. You\'re getting it!', timestamp: '4:09 PM' },
      ],
    },
  ],
  '5': [
    {
      id: 'c5-1',
      agentId: '5',
      title: 'Blog post outline',
      lastUpdated: '4 hours ago',
      messages: [
        { id: 'm1', role: 'user', content: 'I need a blog post about remote work productivity for our company blog.', timestamp: '11:00 AM' },
        { id: 'm2', role: 'assistant', content: 'Great topic! What\'s your target audience—managers, individual contributors, or both?', timestamp: '11:01 AM' },
        { id: 'm3', role: 'user', content: 'Primarily individual contributors who are new to remote work.', timestamp: '11:02 AM' },
        { id: 'm4', role: 'assistant', content: 'Perfect. I suggest a practical, empathetic tone. Here\'s an outline: 1) Setting up your space 2) Time blocking techniques 3) Communication boundaries 4) Avoiding burnout.', timestamp: '11:03 AM' },
        { id: 'm5', role: 'user', content: 'Can you draft the intro paragraph?', timestamp: '11:05 AM' },
        { id: 'm6', role: 'assistant', content: '"Working from home sounds dreamy until you realize your couch is too comfortable and your fridge is too close. After three years of remote work, I\'ve learned that productivity isn\'t about willpower—it\'s about systems."', timestamp: '11:06 AM' },
      ],
    },
  ],
  '6': [
    {
      id: 'c6-1',
      agentId: '6',
      title: 'Morning routine optimization',
      lastUpdated: '5 hours ago',
      messages: [
        { id: 'm1', role: 'user', content: 'I can\'t seem to stick to a morning routine. Any tips?', timestamp: '7:00 AM' },
        { id: 'm2', role: 'assistant', content: 'The key is starting small. What time do you currently wake up, and what\'s the first thing you do?', timestamp: '7:01 AM' },
        { id: 'm3', role: 'user', content: 'I wake up at 7 and immediately check my phone for 30 minutes.', timestamp: '7:02 AM' },
        { id: 'm4', role: 'assistant', content: 'That\'s your first optimization target. Phone checking triggers reactive mode. Try charging your phone outside the bedroom and replacing it with 5 minutes of stretching.', timestamp: '7:03 AM' },
        { id: 'm5', role: 'user', content: 'But what if I miss important messages?', timestamp: '7:05 AM' },
        { id: 'm6', role: 'assistant', content: 'Nothing sent at 7 AM is truly urgent. Give yourself 30 minutes of "airplane mode" time. Your focus and mental clarity will improve dramatically.', timestamp: '7:06 AM' },
        { id: 'm7', role: 'user', content: 'That makes sense. I\'ll try it tomorrow.', timestamp: '7:08 AM' },
        { id: 'm8', role: 'assistant', content: 'Start tonight by placing your phone in another room. Momentum begins with one small win. Let me know how it goes!', timestamp: '7:09 AM' },
      ],
    },
  ],
};
