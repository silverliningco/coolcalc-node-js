# COOLCALC NODE JS #
This is a sample Node server-side library for the CoolCalc MJ8 application.  We are not a Node shop, do not use this code "as is" but evaluate if changes are required to meet your production criteria.  Suggestions for improvement and pull requests are welcome.

## Basic configuration for your own installation: ##
1. Enter your API credentials in (2) dealers.js and mj8_report.js (endpoints).

2. Implement the session-user endpoint session_user.js. The particulars of the implementation will be determined by the session/user authentication mechanisms your application uses.  See comments and sample output in filesession_user (endpoints).

## Additional customizations for production servers: ##
3. In production you must verify that the dealer id (customer account nr) in the REST URL corresponds to the actual session user to prevent dishonest users from downloading someone else's project list.  See the comments in function  dealers.js Actual implementation will vary based on your specific user accounts/session management.

