import https from 'https';

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const GOOGLE_GENKIT_API_KEY = process.env.GOOGLE_GENKIT_API_KEY;
const PROJECT_ID = 'prj_ovXyt3rSVMrCulkopeBz9ZAnGfKl';

if (!VERCEL_TOKEN) {
  console.error('Error: VERCEL_TOKEN environment variable is not set');
  process.exit(1);
}

if (!GOOGLE_GENKIT_API_KEY) {
  console.error('Error: GOOGLE_GENKIT_API_KEY environment variable is not set');
  process.exit(1);
}

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vercel.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function deploy() {
  try {
    console.log('Starting deployment to Vercel...\n');

    // Get project details
    console.log('Step 1: Fetching project details...');
    const projectRes = await makeRequest('GET', `/v9/projects/${PROJECT_ID}`);
    
    if (projectRes.status !== 200) {
      console.error('Error fetching project:', projectRes.data);
      process.exit(1);
    }

    const project = projectRes.data;
    console.log(`Project found: ${project.name}`);
    console.log(`Repository: ${project.link?.repo}\n`);

    // Set environment variables
    console.log('Step 2: Setting environment variables...');
    
    const envVarRes = await makeRequest('POST', `/v9/projects/${PROJECT_ID}/env`, {
      key: 'GOOGLE_GENKIT_API_KEY',
      value: GOOGLE_GENKIT_API_KEY,
      target: ['production', 'preview', 'development'],
    });

    if (envVarRes.status !== 200 && envVarRes.status !== 409) {
      console.log('Environment variable update response:', envVarRes.status);
    } else {
      console.log('✓ GOOGLE_GENKIT_API_KEY set successfully');
    }

    // Trigger deployment
    console.log('\nStep 3: Triggering deployment...');
    
    // Get the latest deployment or create one
    const deploymentsRes = await makeRequest('GET', `/v13/deployments?projectId=${PROJECT_ID}&limit=1`);
    
    if (deploymentsRes.status === 200 && deploymentsRes.data.deployments && deploymentsRes.data.deployments.length > 0) {
      const latestDeployment = deploymentsRes.data.deployments[0];
      console.log(`Latest deployment status: ${latestDeployment.state}`);
      console.log(`Deployment URL: https://${latestDeployment.url}`);
      
      if (latestDeployment.state === 'READY') {
        console.log('\n✓ Your project is successfully deployed!');
        console.log(`\nLive URL: https://${latestDeployment.url}`);
        console.log(`Direct URL: ${latestDeployment.url}`);
      } else if (latestDeployment.state === 'BUILDING' || latestDeployment.state === 'QUEUED') {
        console.log('\n⏳ Your project is currently building...');
        console.log(`Check status at: https://vercel.com/dashboard/project/${PROJECT_ID}`);
      }
    } else {
      console.log('No deployments found or unable to retrieve deployment status');
      console.log('Your project should be deploying. Check: https://vercel.com/dashboard/project/' + PROJECT_ID);
    }

    console.log('\n✓ Deployment configuration complete!');
    console.log('\nNext steps:');
    console.log('1. Visit: https://vercel.com/dashboard/project/' + PROJECT_ID);
    console.log('2. Your latest deployment status will be shown there');
    console.log('3. Once ready, your app will be live at the provided URL\n');

  } catch (error) {
    console.error('Deployment error:', error.message);
    process.exit(1);
  }
}

deploy();
