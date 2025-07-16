import { Router, Request, Response } from 'express';
import readmeElementService from '../services/readmeElement.service';

const router = Router();

// Interfaces for request parameters
interface UsernameParams {
  username: string;
}

interface ThemeParams extends UsernameParams {
  theme?: string;
  height?: string;
  width?: string;
  hideBorder?: boolean;
  showIcons?: boolean;
  locale?: string;
  rankIcon?: 'github' | 'percentile';
  cardType?: 'level' | 'octocat' | 'github' | 'level-alternate';
  ttl?: number; // Cache TTL in seconds
}

// Helper function to create URL with params
const buildUrl = (baseUrl: string, params: Record<string, string | boolean | number | undefined>): string => {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });
  return url.toString();
};

// Helper function to create element data
const createElementData = (
  type: string,
  subtype: string,
  username: string,
  theme: string | undefined,
  data: any,
  markdown: string,
  ttl: number = 86400 // Default 24 hours
) => ({
  type,
  subtype,
  username,
  theme,
  data,
  markdown,
  ttl
});

/**
 * @route GET /contribution/graph1
 * @description Get contribution graph 1 with MongoDB caching
 */

router.get('/contribution/graph1', async (req: Request<{}, {}, {}, ThemeParams>, res: Response) => {
  try {
    const { username, theme = 'react-dark', hideBorder = false, ttl } = req.query;
    console.log("route hit and username is", username)
    // Generate the URL
    const url = buildUrl(`https://github-readme-activity-graph.vercel.app/graph`, {
      username,
      theme,
      hide_border: hideBorder
    });
    
    const markdown = `<img src="${url}" alt="GitHub Activity Graph">`;
    
    // Store in MongoDB with caching
    const element = await readmeElementService.getOrCreateElement(
        // @ts-ignore
      createElementData('contribution', 'graph1', username, theme, { hideBorder }, markdown, ttl)
    );
    
    res.json({ 
      id: element._id,
      url,
      markdown,
      cached: element.lastUpdated < new Date() // Indicates if this is a cached response
    });
  } catch (error) {
    console.error('Error in /contribution/graph1:', error);
    res.status(500).json({ error: 'Failed to fetch contribution graph' });
  }
});

/**
 * @route GET /contribution/graph2
 * @description Get contribution graph 2 with profile details and MongoDB caching
 */
router.get('/contribution/graph2', async (req: Request<{}, {}, {}, ThemeParams>, res: Response) => {
  try {
    const { username, theme = 'radical', ttl } = req.query;
    
    // Generate the URL
    const url = `https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=${username}&theme=${theme}`;
    
    const markdown = `<img height="180em" src="${url}" alt="GitHub Profile Details">`;
    
    // Store in MongoDB with caching
    const element = await readmeElementService.getOrCreateElement(
        // @ts-ignore
      createElementData('contribution', 'graph2', username, theme, {}, markdown, ttl)
    );
    
    res.json({ 
      id: element._id,
      url,
      markdown,
      cached: element.lastUpdated < new Date() // Indicates if this is a cached response
    });
  } catch (error) {
    console.error('Error in /contribution/graph2:', error);
    res.status(500).json({ error: 'Failed to fetch contribution graph' });
  }
});

/**
 * @route GET /stats/card1
 * @description Get stats card 1 with MongoDB caching
 */
router.get('/stats/card1', async (req: Request<{}, {}, {}, ThemeParams>, res: Response) => {
  try {
    const { username, theme = 'tokyonight', ttl } = req.query;
    
    // Generate the URL
    const url = `https://awesome-github-stats.azurewebsites.net/user-stats/${username}?theme=${theme}`;
    
    const markdown = `<img height="180em" src="${url}" alt="GitHub Stats">`;
    
    // Store in MongoDB with caching
    const element = await readmeElementService.getOrCreateElement(
        // @ts-ignore
      createElementData('stats', 'card1', username, theme, {}, markdown, ttl)
    );
    
    res.json({ 
      id: element._id,
      url,
      markdown,
      cached: element.lastUpdated < new Date() // Indicates if this is a cached response
    });
  } catch (error) {
    console.error('Error in /stats/card1:', error);
    res.status(500).json({ error: 'Failed to fetch stats card' });
  }
});

/**
 * @route GET /stats/card2
 * @description Get stats card 2 with octocat style and MongoDB caching
 */
router.get('/stats/card2', async (req: Request<{}, {}, {}, ThemeParams>, res: Response) => {
  try {
    const { username, theme = 'github', cardType = 'octocat', ttl } = req.query;
    
    // Generate the URL
    const url = `https://awesome-github-stats.azurewebsites.net/user-stats/${username}?theme=${theme}&cardType=${cardType}`;
    
    const markdown = `<img height="180em" src="${url}" alt="GitHub Stats">`;
    
    // Store in MongoDB with caching
    const element = await readmeElementService.getOrCreateElement(
        // @ts-ignore
      createElementData('stats', 'card2', username, theme, { cardType }, markdown, ttl)
    );
    
    res.json({ 
      id: element._id,
      url,
      markdown,
      cached: element.lastUpdated < new Date() // Indicates if this is a cached response
    });
  } catch (error) {
    console.error('Error in /stats/card2:', error);
    res.status(500).json({ error: 'Failed to fetch stats card' });
  }
});

/**
 * @route GET /languages/top
 * @description Get top languages card with MongoDB caching
 */
router.get('/languages/top', async (req: Request<{}, {}, {}, ThemeParams>, res: Response) => {
  try {
    const { username, theme = 'radical', hideBorder = false, showIcons = true, ttl } = req.query;
    
    // Generate the URL
    const url = buildUrl(`https://github-readme-stats.vercel.app/api/top-langs`, {
      username,
      theme,
      hide_border: hideBorder,
      show_icons: showIcons,
    });
    
    const markdown = `<img height="180em" src="${url}" alt="Top Languages">`;
    
    // Store in MongoDB with caching
    const element = await readmeElementService.getOrCreateElement(
        // @ts-ignore
      createElementData('languages', 'top', username, theme, { hideBorder, showIcons }, markdown, ttl)
    );
    
    res.json({ 
      id: element._id,
      url,
      markdown,
      cached: element.lastUpdated < new Date() // Indicates if this is a cached response
    });
  } catch (error) {
    console.error('Error in /languages/top:', error);
    res.status(500).json({ error: 'Failed to fetch top languages card' });
  }
});

/**
 * @route GET /stats/streak
 * @description Get GitHub streak stats with MongoDB caching
 */
router.get('/stats/streak', async (req: Request<{}, {}, {}, ThemeParams>, res: Response) => {
  try {
    const { username, theme = 'radical', hideBorder = false, ttl } = req.query;
    
    // Generate the URL
    const url = buildUrl(`https://github-readme-streak-stats.herokuapp.com`, {
      user: username,
      theme,
      hide_border: hideBorder
    });
    
    const markdown = `<img src="${url}" alt="GitHub Streak">`;
    
    // Store in MongoDB with caching
    const element = await readmeElementService.getOrCreateElement(
        // @ts-ignore
      createElementData('stats', 'streak', username, theme, { hideBorder }, markdown, ttl)
    );
    
    res.json({ 
      id: element._id,
      url,
      markdown,
      cached: element.lastUpdated < new Date() // Indicates if this is a cached response
    });
  } catch (error) {
    console.error('Error in /stats/streak:', error);
    res.status(500).json({ error: 'Failed to fetch streak stats' });
  }
});

/**
 * @route GET /repos/details
 * @description Get repository details card with MongoDB caching
 */
router.get('/repos/details', async (req: Request<{}, {}, {}, ThemeParams & { repo: string }>, res: Response) => {
  try {
    const { username, repo, theme = 'radical', ttl } = req.query;
    
    if (!repo) {
      return res.status(400).json({ error: 'Repository name is required' });
    }
    
    // Generate the URL
    const url = `https://github-readme-stats.vercel.app/api/pin/?username=${username}&repo=${repo}&theme=${theme}`;
    
    const markdown = `<img src="${url}" alt="${repo}">`;
    
    // Store in MongoDB with caching
    const element = await readmeElementService.getOrCreateElement(
        // @ts-ignore
      createElementData('repos', 'details', username, theme, { repo }, markdown, ttl)
    );
    
    res.json({ 
      id: element._id,
      url,
      markdown,
      cached: element.lastUpdated < new Date() // Indicates if this is a cached response
    });
  } catch (error) {
    console.error('Error in /repos/details:', error);
    res.status(500).json({ error: 'Failed to fetch repository details' });
  }
});

/**
 * @route GET /trophies
 * @description Get GitHub profile trophies with MongoDB caching
 */
router.get('/trophies', async (req: Request<{}, {}, {}, ThemeParams>, res: Response) => {
  try {
    const { username, theme = 'radical', ttl } = req.query;
    
    // Generate the URL
    const url = `https://github-profile-trophy.vercel.app/?username=${username}&theme=${theme}`;
    
    const markdown = `<img src="${url}" alt="Trophy">`;
    
    // Store in MongoDB with caching
    const element = await readmeElementService.getOrCreateElement(
        // @ts-ignore
      createElementData('trophies', 'profile', username, theme, {}, markdown, ttl)
    );
    
    res.json({ 
      id: element._id,
      url,
      markdown,
      cached: element.lastUpdated < new Date() // Indicates if this is a cached response
    });
  } catch (error) {
    console.error('Error in /trophies:', error);
    res.status(500).json({ error: 'Failed to fetch trophies' });
  }
});

/**
 * @route GET /user/elements/:username
 * @description Get all cached elements for a user
 */
router.get('/user/elements/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const elements = await readmeElementService.getUserElements(username);
    res.json(elements);
  } catch (error) {
    console.error('Error fetching user elements:', error);
    res.status(500).json({ error: 'Failed to fetch user elements' });
  }
});

/**
 * @route DELETE /cache/clear/:username
 * @description Clear cache for a user (optionally filtered by type and subtype)
 */
router.delete('/cache/clear/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { type, subtype } = req.query as { type?: string; subtype?: string };
    
    const count = await readmeElementService.clearCache(username, type, subtype);
    res.json({ 
      message: `Cleared ${count} cached items`,
      username,
      type,
      subtype
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({ error: 'Failed to clear cache' });
  }
});

export default router;