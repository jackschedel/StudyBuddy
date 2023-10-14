// Your Canvas API URL
const UflApiUrl = 'https://corsproxy.io/?https://ufl.instructure.com/api/v1/';
const UflUrl = 'https://corsproxy.io/?https://ufl.instructure.com/';

// Your Canvas API Token for authentication
const UFL_API_KEY = localStorage.getItem("canvas_api_key") || null;

// Function to fetch courses
async function fetchCourses() {
    const response = await fetch(`${UflApiUrl}courses`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${UFL_API_KEY}`
      }
    });
    return await response.json();
  }
  
  // Function to fetch assignments for a given course
  async function fetchAssignments(courseId) { 
    const response = await fetch(`${UflApiUrl}courses/${courseId}/assignments`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${UFL_API_KEY}`
      }
    });
    const assignments = await response.json();
    const validAssignments = [];
    try {
      for (const assignment of assignments){
        // filter out future, old, and locked assignments
        if (assignment.submission_types.includes('online_quiz') && assignment.locked_for_user == false 
        && (new Date(assignment.due_at)).getTime() > (new Date("8/15/2023")).getTime() && (new Date(assignment.due_at)).getTime() < (new Date()).getTime()
        ){
          assignment.html_url = `${UflUrl}courses/${courseId}/assignments/${assignment.id}/history?headless=1`;
            validAssignments.push(assignment)
        }
      }
    } catch (error){
    }
    return validAssignments;
  }
  
  async function fetchQuizzes(courseId) { // for one course
    const response = await fetch(`${UflApiUrl}courses/${courseId}/quizzes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${UFL_API_KEY}`
      }
    });
    const quizzes = await response.json();
    const validQuizzes = [];
    try {
      for (const quiz of quizzes){
        // filter out future, old, hidden, and locked quizzes
        if (quiz.hide_results != "always" && quiz.locked_for_user == false 
        && (new Date(quiz.due_at)).getTime() > (new Date("8/15/2023")).getTime() && (new Date(quiz.due_at)).getTime() < (new Date()).getTime()
        ){
            quiz.html_url = `${UflUrl}courses/${courseId}/quizzes/${quiz.id}/history?headless=1`;
            validQuizzes.push(quiz)
        }
      }
    } catch (error){
    }
    return validQuizzes;
  }

  async function fetchAllAssignments() {  // calls fetchAssignments for each course
    const courses = await fetchCourses();
    const assignments = [];
    try {
        for (const course of courses) {
        const newAssignments = await fetchAssignments(course.id);
        for (const assignment of newAssignments) {
            assignments.push(assignment);
        }
        }
    } catch (error) {
    }
  return assignments;
  }

  async function fetchAllQuizzes() {  // calls fetchQuizzes for each course
    const courses = await fetchCourses();
    const quizzes = [];
    try {
        for (const course of courses) {
        const newQuizzes = await fetchQuizzes(course.id);
        
            for (const quiz of newQuizzes) {
                quizzes.push(quiz);
            }
        } 
    }catch (error) {
      }
  return quizzes;
  }

async function fetchAll(){  // fetch all assignments and quizzes and sort by date them into one list
    const quizzes = await fetchAllQuizzes();
    const assignments = await fetchAllAssignments();
    const newList = [];
    try {
        for (const quiz of quizzes) {
            newList.push(quiz);
        }
    } catch (error) {
          console.log('no quizzes');
      }
    try {
        for (const assignment of assignments) {
            newList.push(assignment);

        }
    } catch (error) {
          console.log('no assignments');
    }
    
    // sort by due date here
    newList.sort(function(a,b){
        return new Date(a.due_at) - new Date(b.due_at);
    });
    return newList;
}
fetchAll().then((data) => {
    console.log("done");
})

export { fetchAll };