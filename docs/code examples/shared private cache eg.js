https://community.openhab.org/t/constants-for-multiple-rule-files/151197/10

// You can pass a lambda that initializes the value in the cache if it’s not already defined.

sharedCache.get('foo', [ | 'bar'])
// That will initialize the entry for ‘foo’ to ‘bar’ if there isn’t already a value there.
// That’s not terribly useful for this particular use case but it is really handy in others, for example timers.

    // Its value cannot be set by a user, unless they are logged in as an Admin (Well - I’m reasonably sure they cannot!!)
// I think they can. Setting metadata is through the /items API endpoint and that endpoint is allowed to all users. I doubt the constraints are more constrained than that but it’s worth a test.


sharedCache.get('foo') // returns null if doesn't exist
sharedCache.put('foo', 'bar')
shareCache.put('foo', null) // deletes the entry

// The same methods exist on privateCache. privateCache is a way to store values between runs of the same rule.

// Note that timers stored in either cache will get cancelled when the last rule with a reference to that entry is unloaded. This is a great way to avoid orphaned timers.