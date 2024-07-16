
* You can of course create your own organizer and student and what not. Program will automatically detect and let you know if account already created.

## Technologies Used

For this web app, we use **Next.js** and **Tailwind CSS** as frontend frameworks. We also use **Firebase** as a "backend" framework to store user data, organization info, assignments, etc. Lastly, we use **Jotai** as local and session storage that is preserved across pages.

* Next JS: We use this for routing pages and image loading/rendering.
    * Routing is really simple. If we would like to create a new page, we simply just create a new file (Ex: `pages/dashboard.tsx`) and then it will create a new route called `dashboard` (ex: `localhost:3000/dashboard`) 

    * You could programmatically route pages using the `useRouter` function from `next/router`. See an example of how its used in `loginPage.tsx`

    * Check more documentation in [here](https://nextjs.org/docs)

* Tailwind CSS:
    * Instead of using React Stylesheets, we use Tailwind CSS for easier and cleaner development.
    
    * Tailwind is really simple. Instead of assigning a div, for example, with an id/class name and then adding the identifier into React Stylesheets, all you need to do is just add keywords to the class name of the object

    * For example, if you want to add `position: absolute`, all you have to do is just add `absolute` to the className and the effect is applied.

    * In almost every `.tsx` file, tailwind will be used, so you can use those as examples. They also have great documentation [here](https://tailwindcss.com/docs). Don't worry about the installation; as long as you installed packages via `npm i` it should be installed. 

* Firebase: 
    * We use Firebase as a data storage and authentication server. This pretty much serves as our "backend" for the entire app.
        * We use Authenticaton service for user/organization authenticaton. We use Firestore to store user info (whether they are organizers or not), assignments, modules, etc.
    
    * This repository contains the firebase keys, so you should be able to register/login automatically.

    * All firebase logic exists in `data.tsx`. It is strongly recommended to not alter this file right now, because in order to test firebase you need read server contents in which only Eshaan and Subha have access to.

    * Say a feature needs Firebase code to be fully completed (ex: deleting an assignment), let us know or commit to this repo (we will continually follow updates to this codebase) and backend engineers will develop code necessary to complete feature.

* Jotai:
    * We use jotai for session and local state management. We use this because it's really simple and fast to develop 
    
    * When the firebase server is updated, the jotai variables are changed with it. That way, we don't have to call the firebase server everytime we request a username for example.

    * Same applies Vice versa: at the start of the home page it calls the firebase server if there are any updates to the modules and assignments in the organization the user is in, and sets the corresponding jotai variables accordingly.
    
    * The jotai variables are declared in `data.tsx`. There are 4 data types created: `user`, `modules`, `assignments`, and `selectedAssignmentsAtom`
        * `user` variable contains informaton about the user. This is a dictionary with the following keys:
            * `username`: the current username as string
            * `userId`: the user id that is defined in firebase; useful for firebase server updates.
            * `isOrganization`: false is the user is not an organization, true if the user is organization.
            * `organizationId`: this contains the short code that the user is required to enter when signing up. This code is displayed in the home component below the "Hello [username]!"
            * `organizationName`: the name of the organization that the user is affliated with.
            * `docOrganizationId`: the organization id that is defined in firebase; useful for firebase server updates.

        * `modules` variable contains information about the modules that are in the classroom. This is an array of dictionaries (for each module defined) with the following keys:
            * `title`: title of the module as string
            * `description`: description of the module as string
            * `id`: the id of the module generated when creating module (used to distinguish between other modules)
            * Modules are used to "group" assignments together.

        * `assignments` variable contains infomration about the assignments that are in the classroom. This is an array of dictionaries (for each assignment defined) with the following keys:
            * `title`: the title of the assignment
            * `type`: the type of the assignment. 0 if it is post, 1 if it is multiple choice (MC).
            * `content`: the content of the assignment. Could be an array of strings if MC or a simple string that displays the description of the post.
            * `date`: the date when the assignment was created. Also used for sorting and id'ing assignments
            * `moduleId`: the id of the module that the assignment is in.

        * `selectedAssignmentsAtom` variable contains information about one specific assignment, that is used to relay information between `classroom` and viewing assignment page (not implemented) and taking quiz (`TakeQuiz.tsx`)
            * In the `classroom` page, a button after each assignment can read "Take Quiz" or "View". Once pressed, it will navigate between a different page (ex: `TakeQuiz.tsx`) that needs to have information on what particular assignment was pressed; this variable is set before the navigation that reads the exact dictionary of the assignment that is pressed.

    * Note that the jotai variables are not *changed* in `data.tsx`, only *declared*. The jotai variables are changed throughout the pages (ex: loginPage.tsx to set the user information)

    * You could access/set jotai variables using the the `useAtom` function. (Ex: `const [user, setUser] = useAtom(userAtom)` in `loginPage.tsx`)
        * calling `setUser` will change the jotai variable. If the atom is declared with `atomWithStorage`, the information will not be lost even if the page is closed. If atom is declared with `atom`, the information is lost once the user closes the page.

## Files in Codebase
To help you get more familiar with the codebase, below are short descriptions of every important files in the codebase. If you have any questions, don't hesitate to ask in the Slack channel.

* `firebase.js`: Contains all keys/backend initialization. 
* `tailwind.config.js`: extension to tailwind CSS to enable shadow around elements by adding `shadow-around-s` or `shadow-around` to class name
* `src`:
    * `pages`:
        * `api/data.tsx`: Main code for data manipulation. Declares local and session storage variables along with updating the Firebase server 
        * `auth/loginPage.tsx`: Login page for authentication. Log in button appears in homepage declared in `index.tsx`. This also handles calling firebase authentication server.
        * `auth/signUpPage.tsx`: Login page for authentication. Log in button appears in homepage declared in `index.tsx`. This also handles calling firebase authentication server.
        * `_app.tsx`: Created when initialize empty next repo; Called during each page of initialization. You could use it to establish a common layout between pages. Not used currently.
        * `_document.tsx`: Created when initialize empty next repo; Used to load fonts and scripts before page loads; Not used currently.
        * `index.tsx`: First page that contains log in + sign up buttons in nav bar (don't worry on completing the landing page, see note at bottom). Buttons will redirect to `auth/loginPage.tsx` or `auth/signUpPage.tsx`.
        * `dashboard.tsx`: When the user is logged in, it will redirect to the dashboard. This has the most components embedded. It contains a tab view on the left which has: home tab, classroom tab, and profile tab (not implemented).
        * `TakeQuiz.tsx`: Page when the user takes a quiz assigned by the teacher. Button to redirect to this page appears in `classroom.tsx`

    * `components`: Components used in individual pages.        
        * `calendar.tsx`: Calendar showed in dashboard page that is meant to show assignments created at specific date. 
        * `classroom.tsx`: Implements view for Classroom Tab for dashboard page. Displays all assignments with filter button (not implemented) and ability to take quiz.
        * `CreateAssignmentModal.tsx`: Modal that shows up when the organizer wants to create their own assignment. Button to open modal exists 1. if user is organizer 2. in dashboard page. There's two tabs for each type of assignment a teacher can post: Multiple choice and Post. The main logic for posting is implemented in the `src/components/CreateAssignment` folder.
        * `CreateModule.tsx`: Modal that shows up when the organizer wants to create their own module (kind of like a folder for every assignment). Button to open modal exists 1. if user is organizer 2. in dashboard page.
        * `home.tsx`: Implements view for Home Page for dashboard page. Displays all assignments, modules, statistics, & calendar
        * `navbar.tsx`: Implements the navbar that's used in `index.tsx`. Includes sign in and sign up button that redirects to `auth` pages.
        * `CreateAssignment/MultipleChoice.tsx`: Implements view when the organizer wants to create a multiple choice assignment. Called in `CreateAssignmentModal.tsx`
        * `CreateAssignment/Post.tsx`: Implements view when the organizer wants to create a post. Called in `CreateAssignmentModal.tsx`
        * `HomeHelper/AssignmentsDisplay.tsx`. Simple div that displays individual assignments in home page.
        * `HomeHelper/ModuleDisplay.tsx`. Simple div that displays individual modules in home page.

## TODO:

* Complete Profile Tab in `dashboard`. Add UI for deleting user, switching classes, displaying statistics, and more. *Backend required**
* Complete Filter feature in `classroom` page. Should filter by assignment type, date, etc.
* Ability to delete assignments & modules. *Backend required*
* Better UI for `TakeQuiz` (kind of plain, maybe we want to keep it like that?)
* More types of assignments. *Brainstorm required* & *Backend required*
* Find out what statistics we should display and implement *Backend required* & *Brainstorming Required*
* Date in `calendar.tsx` overlaps when window size becomes small

