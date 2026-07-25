import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { connectDB } from './connection.js';
import { User } from './models/user.model.js';
import { Task, TaskStatus, TaskPriority } from './models/task.model.js';

const statuses: TaskStatus[] = ['To Do', 'In Progress', 'Done'];
const priorities: TaskPriority[] = ['Low', 'Medium', 'High'];

const sampleTitles = [
  'Refactor API Authentication Middleware',
  'Design Dark Mode Theme Palette',
  'Implement Drag and Drop Kanban Board',
  'Write End-to-End Tests for User Registration',
  'Optimize MongoDB Query Performance',
  'Fix Mobile Navigation Menu Overlay',
  'Integrate Cloudinary Image Upload',
  'Configure Docker Multi-Stage Build',
  'Implement Password Reset Workflow',
  'Add Real-Time WebSockets Notifications',
  'Fix React Form Validation Error Messages',
  'Set Up Automated CI/CD Deployment Pipeline',
  'Audit Dependencies for Security Vulnerabilities',
  'Add Task Filtering by Priority and Status',
  'Create DB Seed Script for Testing',
];

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to Database...');
    await connectDB();

    const targetEmail = 'ahmed@test.com';
    const targetPassword = 'Test@1234';

    // 1. Check or Create Test User
    let user = await User.findOne({ email: targetEmail });

    if (!user) {
      console.log(`[Seed] Creating new test user: ${targetEmail}`);
      user = new User({
        name: 'Ahmed Zahran',
        email: targetEmail,
        password: targetPassword,
      });
      await user.save();
    } else {
      console.log(`[Seed] Test user ${targetEmail} already exists. Updating password...`);
      user.password = targetPassword;
      await user.save();
    }

    // 2. Clear existing tasks for this user
    const deletedCount = await Task.deleteMany({ user: user._id });
    console.log(`[Seed] Cleared ${deletedCount.deletedCount} existing tasks for ${targetEmail}`);

    // 3. Generate 100 Tasks with varied statuses and priorities
    const tasksToInsert = [];
    const now = new Date();

    for (let i = 1; i <= 100; i++) {
      const status = statuses[i % 3]; // Cycles evenly: To Do, In Progress, Done
      const priority = priorities[i % 3]; // Cycles: Low, Medium, High
      const baseTitle = sampleTitles[i % sampleTitles.length];
      
      // Random due date between -10 days and +20 days from now
      const dayOffset = Math.floor(Math.random() * 30) - 10;
      const dueDate = new Date(now.getTime() + dayOffset * 24 * 60 * 60 * 1000);

      tasksToInsert.push({
        title: `${baseTitle} #${i}`,
        description: `Detailed description for task #${i}. This task is assigned to test account ${targetEmail} with priority ${priority} and status ${status}.`,
        status,
        priority,
        dueDate,
        user: user._id,
        attachments: [],
      });
    }

    console.log(`[Seed] Inserting 100 tasks into database...`);
    await Task.insertMany(tasksToInsert);

    console.log('----------------------------------------------------');
    console.log('✅ SEED SUCCESSFUL!');
    console.log(`User Email:    ${targetEmail}`);
    console.log(`User Password: ${targetPassword}`);
    console.log(`Total Tasks:   100 created with varied status & priority`);
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error);
    process.exit(1);
  }
};

seedData();
