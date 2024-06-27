"use client";

import { useState } from 'react';

const TRACKING_DATA = {
  "BOOKMARKED": 2,
  "APPLYING": 0,
  "APPLIED": 1,
  "INTERVIEWING": 0,
  "REJECTED": 0,
}

const JOBS = [
  {
      "id": 1,
      "description": null,
      "jobTitle": "Senior Software Engineer",
      "url": "http://sample-url.com",
      "companyName": "Sample",
      "location": null,
      "status": "APPLIED"
  },
  {
      "id": 2,
      "description": "some description",
      "jobTitle": "Software Engineer - Python",
      "url": "http://madeup.com/careers/1234",
      "companyName": "Madeup Co.",
      "location": "Toronto",
      "status": "BOOKMARKED"
  },
  {
      "id": 3,
      "description": "new description",
      "jobTitle": "Software Engineer - Backend",
      "url": "http://thiscompany.com/careers/1234",
      "companyName": "thiscompany",
      "location": "Remote",
      "status": "BOOKMARKED"
  }
]

type Job = {
  id: number;
  description: string | null;
  jobTitle?: string;
  url: string | null;
  companyName: string | null;
  location: string | null;
  status: string | null;  
}

function TrackingButton({value, filterStatus, onFilterStatusChange}: {value: string, filterStatus: string, onFilterStatusChange: Function}) {
  const count = TRACKING_DATA[value as keyof typeof TRACKING_DATA] ?? 0;
  const formattedCount = count == 0 ? '--' : count

  const handleClick = () => {
    if (filterStatus.toLowerCase() === value.toLowerCase()) {
      onFilterStatusChange('');
    } else {
      onFilterStatusChange(value);
    }
  };

  let buttonClassName = "border border-dashed border-black font-sm w-40 p-4 m-4 font-semibold"
  if (count > 0) {
    buttonClassName += " hover:bg-orange-200"
  }
  if (filterStatus.toLowerCase() === value.toLowerCase()) {
    buttonClassName += " bg-orange-200"
  }

  return (
    <button 
    className={buttonClassName}
    disabled={count===0} 
    onClick={handleClick}>
      <div>{formattedCount}</div>
      <div>{value}</div>
    </button>
  )
}

function TrackingBar({filterStatus, onFilterStatusChange}: {filterStatus: string, onFilterStatusChange: Function}) {
  return (
    <div>
      <TrackingButton value="BOOKMARKED" filterStatus={filterStatus} onFilterStatusChange={onFilterStatusChange}/>
      <TrackingButton value="APPLYING" filterStatus={filterStatus} onFilterStatusChange={onFilterStatusChange}/>
      <TrackingButton value="APPLIED" filterStatus={filterStatus} onFilterStatusChange={onFilterStatusChange}/>
      <TrackingButton value="INTERVIEWING" filterStatus={filterStatus} onFilterStatusChange={onFilterStatusChange}/>
      <TrackingButton value="REJECTED" filterStatus={filterStatus} onFilterStatusChange={onFilterStatusChange}/>
    </div>
  )
}

function SearchBar({filterText, onFilterTextChange}: {filterText: string, onFilterTextChange: Function}) {
  return (
    <div>
      <form>
        <input 
        type="text" 
        placeholder="Filter Jobs" 
        value={filterText} 
        onChange={(e) => onFilterTextChange(e.target.value)}
        className="border border-inherit font-sm w-40 m-4"/>
      </form>
    </div>
  )
}

function JobRow({job}: {job: Job}) {
  let formattedStatus = job.status
  if (job.status) {
    formattedStatus = job.status.charAt(0).toUpperCase() + job.status.slice(1).toLowerCase()
  }

  return (
    <tr key={job.id} className="border">
      <td className="border w-60">{job.jobTitle}</td>
      <td className="border w-52">{job.companyName}</td>
      <td className="border w-52">{job.location}</td>
      <td className="border w-52">{formattedStatus}</td>
    </tr>
  );
}

function JobTable({jobs, filterText, filterStatus}: {jobs: Job[], filterText: string, filterStatus: string}) {
  const rows: JSX.Element[] = [];
  jobs.forEach((job) => {
    if (
      (job.jobTitle === null || (job.jobTitle && job.jobTitle.toLowerCase().indexOf(filterText.toLowerCase()) === -1)) &&
      (job.companyName === null || (job.companyName && job.companyName.toLowerCase().indexOf(filterText.toLowerCase()) === -1)) &&
      (job.location === null || (job.location && job.location.toLowerCase().indexOf(filterText.toLowerCase()) === -1))
    ) {
      return;
    }

    if (job.status && job.status.toLowerCase().indexOf(filterStatus.toLowerCase()) === -1) {
      return
    }

    rows.push(
      <JobRow job={job} key={job.id} />
    );
  });

  return (  
    <div>
        <table className="m-4 border">
          <thead>
            <tr className="border">
              <th className="border">Job Position</th>
              <th className="border">Company</th>
              <th className="border">Location</th>
              <th className="border">Status</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
      </table>
    </div>
  )
}

function JobTrackerTable({jobs}: {jobs: Job[]}) {
  const [filterText, setFilterText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  return (
    <div>
      <TrackingBar filterStatus={filterStatus} onFilterStatusChange={setFilterStatus}/>
      <SearchBar filterText={filterText} onFilterTextChange={setFilterText} />
      <JobTable jobs={jobs} filterText={filterText} filterStatus={filterStatus} />
    </div>
  );
}

export default function App() {
  return <JobTrackerTable jobs={JOBS} />;
}