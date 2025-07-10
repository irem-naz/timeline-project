import timelineUiHtml from './timelineUiHtml';

const sampleData = {
  title: 'Program Timeline Visualization',
  entries: [
    {
      year: '2023',
      program: 'Ma’an',
      issueHeader: 'Session Timing',
      issueInfo: 'Monday sessions were too long and inconvenient, causing attention drop-off.',
      fixApplied: 'NA',
      fixRecommended: 'Schedule sessions on other days and reduce duration to 4-hour blocks.'
    },
    {
      year: '2024',
      program: 'Ma’an',
      issueHeader: 'Content Depth',
      issueInfo: 'Some topics were too shallow.',
      fixApplied: 'Added more advanced modules.',
      fixRecommended: 'Continue to deepen content.'
    },
    {
      year: '2023',
      program: 'TechLeap',
      issueHeader: 'Resource Allocation',
      issueInfo: 'Insufficient laptops for participants.',
      fixApplied: 'Ordered 10 new laptops.',
      fixRecommended: 'Maintain inventory checks.'
    },
    {
      year: '2023',
      program: 'Ma’an',
      issueHeader: 'Session Timing',
      issueInfo: 'Monday sessions were too long and inconvenient, causing attention drop-off.',
      fixApplied: 'NA',
      fixRecommended: 'Schedule sessions on other days and reduce duration to 4-hour blocks.'
    },
    {
      year: '2024',
      program: 'Ma’an',
      issueHeader: 'Content Depth',
      issueInfo: 'Some topics were too shallow.',
      fixApplied: 'Added more advanced modules.',
      fixRecommended: 'Continue to deepen content.'
    },
    {
      year: '2023',
      program: 'TechLeap',
      issueHeader: 'Resource Allocation',
      issueInfo: 'Insufficient laptops for participants.',
      fixApplied: 'Ordered 10 new laptops.',
      fixRecommended: 'Maintain inventory checks.'
    },
    // ... more entries as needed
  ]
};

export default function handler(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(timelineUiHtml(sampleData));
  }