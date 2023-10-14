const UflApiUrl = "https://corsproxy.io/?https://ufl.instructure.com/api/v1/";

// todo: env
const UFL_API_KEY = localStorage.getItem("canvas_api_key") || null;

// Function to fetch courses
async function fetchCourses() {
  const response = await fetch(`${UflApiUrl}courses`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${UFL_API_KEY}`,
    },
  });
  return await response.json();
}

// Function to fetch assignments for a given course
/**
 * @param {any} courseId
 */
async function fetchAssignments(courseId) {
  const response = await fetch(`${UflApiUrl}courses/${courseId}/assignments`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${UFL_API_KEY}`,
    },
  });
  return await response.json();
}

/**
 * @param {any} courseId
 */
async function fetchQuizzes(courseId) {
  const response = await fetch(`${UflApiUrl}courses/${courseId}/quizzes`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${UFL_API_KEY}`,
    },
  });
  return await response.json();
}

/**
 * @param {any} courseId
 */
async function fetchTests(courseId) {
  const response = await fetch(`${UflApiUrl}courses/${courseId}/quizzes`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${UFL_API_KEY}`,
    },
  });
  return await response.json();
}
async function fetchAllAssignments() {
  const courses = await fetchCourses();
  const assignments = [];
  for (const course of courses) {
    const newAssignments = await fetchTests(course.id);
    try {
      for (const assignment of newAssignments) {
        assignments.push(assignment);
      }
    } catch (error) {
      continue;
    }
  }
  return assignments;
}
// Main function to fetch all assignments from all courses
async function fetchAllQuizzes() {
  const courses = await fetchCourses();
  const quizzes = [];
  for (const course of courses) {
    const newQuizzes = await fetchTests(course.id);
    try {
      for (const quiz of newQuizzes) {
        quizzes.push(quiz);
      }
    } catch (error) {
      continue;
    }
  }
  return quizzes;
}
async function fetchAllTests() {
  const courses = await fetchCourses();
  const tests = [];
  for (const course of courses) {
    const newTests = await fetchTests(course.id);
    try {
      for (const test of newTests) {
        tests.push(test);
      }
    } catch (error) {
      continue;
    }
  }
  return tests;
}

async function fetchAll() {
  const tests = await fetchAllTests();
  const quizzes = await fetchAllQuizzes();
  const assignments = await fetchAllAssignments();

  const newList = [];
  try {
    for (const test of tests) {
      newList.push(test);
    }
  } catch (error) {
    console.log("no tests");
  }
  try {
    for (const quiz of quizzes) {
      newList.push(quiz);
    }
  } catch (error) {
    console.log("no quizzes");
  }
  try {
    for (const assignment of assignments) {
      newList.push(assignment);
    }
  } catch (error) {
    console.log("no assignments");
  }

  // sort by due date here
  for (const item of newList) {
    console.log(item.name);
  }
  return newList;
}

fetchAll().then((data) => {
  for (const item of data) {
    console.log(item);
  }
});

export { fetchAssignments };
