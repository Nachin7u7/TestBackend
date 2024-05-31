import mongoose from 'mongoose';
import Problem from '../../entities/implements/ProblemEntity'

const seed = async () => {
  const problems = [
    {
      "problemId": 14,
      "author": "662105a622d466c003968b48",
      "problemName": "Number Of Rectangles",
      "isPublished": true,
      "saved": {
        "statement": "<p>In a 2D grid of size MxN, you have to count the number of rectangles that can be formed using the grid lines.</p><p>Each rectangle must be formed by the intersection of vertical and horizontal lines of the grid.</p>",
        "inputFormat": "<p>The input consists of several test cases. The first line contains an integer T representing the number of test cases (1 ≤ T ≤ 100). Each of the next T lines contains two integers M and N (1 ≤ M, N ≤ 1000) representing the dimensions of the grid.</p><p>The input must be read from standard input (keyboard).</p>",
        "outputFormat": "<p>For each test case, your program must output the number of rectangles that can be formed in the grid on a new line.</p><p>The output must be standard output (screen).</p>",
        "constraints": "<p>1 ≤ T ≤ 100</p><p>1 ≤ M, N ≤ 1000</p>",
        "testcases": [
          {
            "input": {
              "url": "2\r\n2 2\r\n3 3\r\n",
              "fileName": "input2.txt"
            },
            "output": {
              "url": "9\r\n36",
              "fileName": "output2.txt"
            },
            "isSample": true,
          }
        ],
        "checkerCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int T;\n    cin >> T;\n    while (T--) {\n        int M, N;\n        cin >> M >> N;\n        long long result = (M * (M + 1) / 2) * (N * (N + 1) / 2);\n        cout << result << endl;\n    }\n    return 0;\n}",
        "explanation": "<p><strong>Grid Dimensions (M, N):</strong></p><ul><li>Two integers representing the number of rows and columns in the grid.</li><li>Constraints: 1 ≤ M, N ≤ 1000</li></ul><p><strong>Output:</strong></p><ul><li><strong>Number of Rectangles:</strong><ul><li>An integer representing the number of rectangles that can be formed using the grid lines.</li></ul></li></ul>",
        "config": {
          "timelimit": 2000,
          "memorylimit": 485,
          "difficulty": {
            "value": 2,
            "label": "Medium"
          },
          "tags": [],
        }
      },
      "published": {
        "statement": "<p>In a 2D grid of size MxN, you have to count the number of rectangles that can be formed using the grid lines.</p><p>Each rectangle must be formed by the intersection of vertical and horizontal lines of the grid.</p>",
        "inputFormat": "<p>The input consists of several test cases. The first line contains an integer T representing the number of test cases (1 ≤ T ≤ 100). Each of the next T lines contains two integers M and N (1 ≤ M, N ≤ 1000) representing the dimensions of the grid.</p><p>The input must be read from standard input (keyboard).</p>",
        "outputFormat": "<p>For each test case, your program must output the number of rectangles that can be formed in the grid on a new line.</p><p>The output must be standard output (screen).</p>",
        "constraints": "<p>1 ≤ T ≤ 100</p><p>1 ≤ M, N ≤ 1000</p>",
        "testcases": [
          {
            "input": {
              "url": "2\r\n2 2\r\n3 3\r\n",
              "fileName": "input2.txt"
            },
            "output": {
              "url": "9\r\n36",
              "fileName": "output2.txt"
            },
            "isSample": true,
          }
        ],
        "checkerCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int T;\n    cin >> T;\n    while (T--) {\n        int M, N;\n        cin >> M >> N;\n        long long result = (M * (M + 1) / 2) * (N * (N + 1) / 2);\n        cout << result << endl;\n    }\n    return 0;\n}",
        "explanation": "<p><strong>Grid Dimensions (M, N):</strong></p><ul><li>Two integers representing the number of rows and columns in the grid.</li><li>Constraints: 1 ≤ M, N ≤ 1000</li></ul><p><strong>Output:</strong></p><ul><li><strong>Number of Rectangles:</strong><ul><li>An integer representing the number of rectangles that can be formed using the grid lines.</li></ul></li></ul>",
        "config": {
          "timelimit": 2000,
          "memorylimit": 485,
          "difficulty": {
            "value": 2,
            "label": "Medium"
          }
        }
      },
      "solvedCount": 5,
      "totalSubmissions": 10,
      "submissions": [],
      "createdAt": new Date('2024-04-24T03:00:37.179Z'),
      "updatedAt": new Date('2024-05-28T18:59:18.947Z'),
      "__v": 0
    },
    {
      "problemId": 15,
      "author": "662105a622d466c003968b48",
      "problemName": "Largest Palindrome Product",
      "isPublished": true,
      "saved": {
        "statement": "<p>Given an integer N, find the largest palindrome made from the product of two N-digit numbers.</p><p>A palindrome is a number that reads the same backward as forward.</p>",
        "inputFormat": "<p>The input consists of a single integer N (1 ≤ N ≤ 3).</p><p>The input must be read from standard input (keyboard).</p>",
        "outputFormat": "<p>Your program must output the largest palindrome made from the product of two N-digit numbers on a new line.</p><p>The output must be standard output (screen).</p>",
        "constraints": "<p>1 ≤ N ≤ 3</p>",
        "testcases": [
          {
            "input": {
              "url": "2\r\n",
              "fileName": "input3.txt"
            },
            "output": {
              "url": "9009\r\n",
              "fileName": "output3.txt"
            },
            "isSample": true,
          }
        ],
        "checkerCode": "#include <bits/stdc++.h>\r\nusing namespace std;\r\n\r\nbool isPalindrome(int num) {\r\n    int original = num, reversed = 0;\r\n    while (num > 0) {\r\n        reversed = reversed * 10 + (num % 10);\r\n        num /= 10;\r\n    }\r\n    return original == reversed;\r\n}\r\n\r\nint main() {\r\n    int N;\r\n    cin >> N;\r\n    int maxNum = 1, minNum = 1;\r\n    for (int i = 0; i < N; i++) {\r\n        maxNum *= 10;\r\n        minNum *= 10;\r\n    }\r\n    minNum /= 10;\r\n    maxNum -= 1;\r\n\r\n    int maxPalindrome = 0;\r\n    for (int i = maxNum; i >= minNum; i--) {\r\n        for (int j = i; j >= minNum; j--) {\r\n            int product = i * j;\r\n            if (isPalindrome(product) && product > maxPalindrome) {\r\n                maxPalindrome = product;\r\n            }\r\n        }\r\n    }\r\n    cout << maxPalindrome << endl;\r\n    return 0;\r\n}\r\n",
        "explanation": "<p><strong>Number of Digits (N):</strong></p><ul><li>An integer representing the number of digits of the numbers to be multiplied.</li><li>Constraints: 1 ≤ N ≤ 3</li></ul><p><strong>Output:</strong></p><ul><li><strong>Largest Palindrome Product:</strong><ul><li>An integer representing the largest palindrome made from the product of two N-digit numbers.</li></ul></li></ul>",
        "config": {
          "timelimit": 2000,
          "memorylimit": 485,
          "difficulty": {
            "value": 2,
            "label": "Medium"
          }
        }
      },
      "published": {
        "statement": "<p>Given an integer N, find the largest palindrome made from the product of two N-digit numbers.</p><p>A palindrome is a number that reads the same backward as forward.</p>",
        "inputFormat": "<p>The input consists of a single integer N (1 ≤ N ≤ 3).</p><p>The input must be read from standard input (keyboard).</p>",
        "outputFormat": "<p>Your program must output the largest palindrome made from the product of two N-digit numbers on a new line.</p><p>The output must be standard output (screen).</p>",
        "constraints": "<p>1 ≤ N ≤ 3</p>",
        "testcases": [
          {
            "input": {
              "url": "2\r\n",
              "fileName": "input3.txt"
            },
            "output": {
              "url": "9009\r\n",
              "fileName": "output3.txt"
            },
            "isSample": true,
          }
        ],
        "checkerCode": "#include <bits/stdc++.h>\r\nusing namespace std;\r\n\r\nbool isPalindrome(int num) {\r\n    int original = num, reversed = 0;\r\n    while (num > 0) {\r\n        reversed = reversed * 10 + (num % 10);\r\n        num /= 10;\r\n    }\r\n    return original == reversed;\r\n}\r\n\r\nint main() {\r\n    int N;\r\n    cin >> N;\r\n    int maxNum = 1, minNum = 1;\r\n    for (int i = 0; i < N; i++) {\r\n        maxNum *= 10;\r\n        minNum *= 10;\r\n    }\r\n    minNum /= 10;\r\n    maxNum -= 1;\r\n\r\n    int maxPalindrome = 0;\r\n    for (int i = maxNum; i >= minNum; i--) {\r\n        for (int j = i; j >= minNum; j--) {\r\n            int product = i * j;\r\n            if (isPalindrome(product) && product > maxPalindrome) {\r\n                maxPalindrome = product;\r\n            }\r\n        }\r\n    }\r\n    cout << maxPalindrome << endl;\r\n    return 0;\r\n}\r\n",
        "explanation": "<p><strong>Number of Digits (N):</strong></p><ul><li>An integer representing the number of digits of the numbers to be multiplied.</li><li>Constraints: 1 ≤ N ≤ 3</li></ul><p><strong>Output:</strong></p><ul><li><strong>Largest Palindrome Product:</strong><ul><li>An integer representing the largest palindrome made from the product of two N-digit numbers.</li></ul></li></ul>",
        "config": {
          "timelimit": 2000,
          "memorylimit": 485,
          "difficulty": {
            "value": 2,
            "label": "Medium"
          }
        }
      },
      "solvedCount": 5,
      "totalSubmissions": 10,
      "submissions": [],
      "createdAt": new Date('2024-04-24T03:00:37.179Z'),
      "updatedAt": new Date('2024-05-28T18:59:18.947Z'),
      "__v": 0
    },
    {
      "problemId": 16,
      "author": "662105a622d466c003968b48",
      "problemName": "MaximalRectangle",
      "isPublished": true,
      "saved": {
        "statement": "<p>Given a binary matrix, find the largest rectangle containing only 1's and return its area.</p><p>The binary matrix is a 2D grid of 0's and 1's.</p>",
        "inputFormat": "<p>The input consists of several test cases. Each test case starts with two integers M and N (1 ≤ M, N ≤ 100) representing the dimensions of the binary matrix. The next M lines contain N integers (0 or 1) representing the binary matrix.</p><p>The input must be read from standard input (keyboard).</p>",
        "outputFormat": "<p>For each test case, your program must output the area of the largest rectangle containing only 1's on a new line.</p><p>The output must be standard output (screen).</p>",
        "constraints": "<p>1 ≤ M, N ≤ 100</p>",
        "testcases": [
          {
            "input": {
              "url": "2\r\n4 5\r\n1 0 1 0 0\r\n1 0 1 1 1\r\n1 1 1 1 1\r\n1 0 0 1 0\r\n3 4\r\n0 1 1 0\r\n1 1 1 1\r\n0 1 1 0\r\n",
              "fileName": "input4.txt"
            },
            "output": {
              "url": "6\r\n4",
              "fileName": "output4.txt"
            },
            "isSample": true,
          }
        ],
        "checkerCode": "#include <bits/stdc++.h>\r\nusing namespace std;\r\n\r\nint maximalRectangle(vector<vector<int>>& matrix) {\r\n    if (matrix.empty()) return 0;\r\n    int maxArea = 0;\r\n    vector<int> heights(matrix[0].size(), 0);\r\n    \r\n    for (const auto& row : matrix) {\r\n        for (size_t i = 0; i < row.size(); ++i) {\r\n            heights[i] = row[i] == 0 ? 0 : heights[i] + 1;\r\n        }\r\n        \r\n        stack<int> st;\r\n        heights.push_back(0);\r\n        for (size_t i = 0; i < heights.size(); ++i) {\r\n            while (!st.empty() && heights[st.top()] >= heights[i]) {\r\n                int h = heights[st.top()];\r\n                st.pop();\r\n                int w = st.empty() ? i : i - st.top() - 1;\r\n                maxArea = max(maxArea, h * w);\r\n            }\r\n            st.push(i);\r\n        }\r\n        heights.pop_back();\r\n    }\r\n    \r\n    return maxArea;\r\n}\r\n\r\nint main() {\r\n    int T;\r\n    cin >> T;\r\n    while (T--) {\r\n        int M, N;\r\n        cin >> M >> N;\r\n        vector<vector<int>> matrix(M, vector<int>(N));\r\n        for (int i = 0; i < M; ++i) {\r\n            for (int j = 0; j < N; ++j) {\r\n                cin >> matrix[i][j];\r\n            }\r\n        }\r\n        cout << maximalRectangle(matrix) << endl;\r\n    }\r\n    return 0;\r\n}\r\n",
        "explanation": "<p><strong>Binary Matrix Dimensions (M, N):</strong></p><ul><li>Two integers representing the number of rows and columns in the binary matrix.</li><li>Constraints: 1 ≤ M, N ≤ 100</li></ul><p><strong>Output:</strong></p><ul><li><strong>Area of the Largest Rectangle:</strong><ul><li>An integer representing the area of the largest rectangle containing only 1's in the binary matrix.</li></ul></li></ul>",
        "config": {
          "timelimit": 2000,
          "memorylimit": 485,
          "difficulty": {
            "value": 2,
            "label": "Medium"
          }
        }
      },
      "published": {
        "statement": "<p>Given a binary matrix, find the largest rectangle containing only 1's and return its area.</p><p>The binary matrix is a 2D grid of 0's and 1's.</p>",
        "inputFormat": "<p>The input consists of several test cases. Each test case starts with two integers M and N (1 ≤ M, N ≤ 100) representing the dimensions of the binary matrix. The next M lines contain N integers (0 or 1) representing the binary matrix.</p><p>The input must be read from standard input (keyboard).</p>",
        "outputFormat": "<p>For each test case, your program must output the area of the largest rectangle containing only 1's on a new line.</p><p>The output must be standard output (screen).</p>",
        "constraints": "<p>1 ≤ M, N ≤ 100</p>",
        "testcases": [
          {
            "input": {
              "url": "2\r\n4 5\r\n1 0 1 0 0\r\n1 0 1 1 1\r\n1 1 1 1 1\r\n1 0 0 1 0\r\n3 4\r\n0 1 1 0\r\n1 1 1 1\r\n0 1 1 0\r\n",
              "fileName": "input4.txt"
            },
            "output": {
              "url": "6\r\n4",
              "fileName": "output4.txt"
            },
            "isSample": true,
          }
        ],
        "checkerCode": "#include <bits/stdc++.h>\r\nusing namespace std;\r\n\r\nint maximalRectangle(vector<vector<int>>& matrix) {\r\n    if (matrix.empty()) return 0;\r\n    int maxArea = 0;\r\n    vector<int> heights(matrix[0].size(), 0);\r\n    \r\n    for (const auto& row : matrix) {\r\n        for (size_t i = 0; i < row.size(); ++i) {\r\n            heights[i] = row[i] == 0 ? 0 : heights[i] + 1;\r\n        }\r\n        \r\n        stack<int> st;\r\n        heights.push_back(0);\r\n        for (size_t i = 0; i < heights.size(); ++i) {\r\n            while (!st.empty() && heights[st.top()] >= heights[i]) {\r\n                int h = heights[st.top()];\r\n                st.pop();\r\n                int w = st.empty() ? i : i - st.top() - 1;\r\n                maxArea = max(maxArea, h * w);\r\n            }\r\n            st.push(i);\r\n        }\r\n        heights.pop_back();\r\n    }\r\n    \r\n    return maxArea;\r\n}\r\n\r\nint main() {\r\n    int T;\r\n    cin >> T;\r\n    while (T--) {\r\n        int M, N;\r\n        cin >> M >> N;\r\n        vector<vector<int>> matrix(M, vector<int>(N));\r\n        for (int i = 0; i < M; ++i) {\r\n            for (int j = 0; j < N; ++j) {\r\n                cin >> matrix[i][j];\r\n            }\r\n        }\r\n        cout << maximalRectangle(matrix) << endl;\r\n    }\r\n    return 0;\r\n}\r\n",
        "explanation": "<p><strong>Binary Matrix Dimensions (M, N):</strong></p><ul><li>Two integers representing the number of rows and columns in the binary matrix.</li><li>Constraints: 1 ≤ M, N ≤ 100</li></ul><p><strong>Output:</strong></p><ul><li><strong>Area of the Largest Rectangle:</strong><ul><li>An integer representing the area of the largest rectangle containing only 1's in the binary matrix.</li></ul></li></ul>",
        "config": {
          "timelimit": 2000,
          "memorylimit": 485,
          "difficulty": {
            "value": 2,
            "label": "Medium"
          }
        }
      },
      "solvedCount": 5,
      "totalSubmissions": 10,
      "submissions": [],
      "createdAt": new Date('2024-04-24T03:00:37.179Z'),
      "updatedAt": new Date('2024-05-28T18:59:18.947Z'),
      "__v": 0
    },
                
  ];
  

  try {
    await Problem.insertMany(problems);
    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error inserting seed data:', error);
  } finally {
    mongoose.connection.close();
  }
};

export default seed;