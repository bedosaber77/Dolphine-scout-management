const UpcomingEvents = ({ events }) => {
  return (
    <div className="container max-w-5xl px-4 py-16 mx-auto" dir="ltr">
      <div className="grid gap-8 mx-4 sm:grid-cols-12">
        <div className="col-span-12 sm:col-span-3">
          <div className="text-center sm:text-left mb-16 before:block before:w-24 before:h-3 before:mb-8 before:rounded-md before:mx-auto sm:before:mx-0 before:dark:bg-blue-600">
            <h3 className="text-3xl font-semibold mb-8">
              {' '}
              {/* Added mb-8 for more gap */}
              الاحداث القادمة
            </h3>
          </div>
        </div>
        <div className="relative col-span-12 px-4 space-y-8 sm:col-span-9">
          <div className="col-span-12 space-y-16 relative px-4 sm:col-span-8 sm:space-y-12 sm:before:absolute sm:before:top-2 sm:before:bottom-0 sm:before:w-0.5 sm:before:-left-3 before:dark:bg-gray-300">
            {events.map((event) => {
              return (
                <div
                  key={event.id}
                  className="flex flex-col sm:relative sm:before:absolute sm:before:top-2 sm:before:w-4 sm:before:h-4 sm:before:rounded-full sm:before:left-[-35px] sm:before:z-[1] before:dark:bg-blue-600"
                >
                  <h1 className="text-xl font-semibold tracking-wide">
                    {event.name}
                  </h1>
                  <time className="text-xs tracking-wide uppercase dark:text-gray-600">
                    {event.date}
                  </time>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents;
