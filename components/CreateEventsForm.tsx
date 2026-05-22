'use client'

import { createEvent } from '@/app/actions'

export default function CreateEventForm() {
  return (
    <form action={createEvent} className="flex gap-4 items-end flex-wrap">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium mb-1">Event Name</label>
        <input type="text" name="name" required className="w-full border rounded-md p-2" />
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium mb-1">Date</label>
        <input type="datetime-local" name="date" required className="w-full border rounded-md p-2" />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 w-full sm:w-auto">
        Create
      </button>
    </form>
  )
}