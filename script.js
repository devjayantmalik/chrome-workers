
// Let's have a task that we need to process.
let task = {
		id: "1",
    startTime: new Date(), // start or continue watching video.
    endTime: new Date("2023-05-16T13:14:54.760Z"), // stop watching video at this time.
    searchQuery: "om chanting 10 hours golden glimpses",
    searchItemSelector: "a[title='Om Mantra Chanting 10 Hours']",
    isSubscribeRequired: true,
    isLikeRequired: true,
    comment: "Superb, This video provides me inner peace.",
}

const initialStatus = {
		currentTaskId: "",
		isSearchDone: false,
		isVideoItemSelected: false,
		isSubscribed: false,
		isLiked: false,
		isCommented: false,
	};

class YoutubeViewer{
	 status = initialStatus;
		
	execute(){
		const interval = setInterval(async () => {
			try{
			
			// Get current task and start doing actions.
			const task = this.checkCurrentTask();
			this.bot = new YoutubeActions(task);
			if(this.status.currentTaskId !== task.id) {
				this.status = initialStatus;
				this.status.currentTaskId = task.id;
			}
			
			// Search for video on youtube
			if(!this.status.isSearchDone) {
				this.bot.search();
				this.isSearchDone = true;
				return;
			}
			
			// Select Video Item to Watch.
			if(!this.status.isVideoItemSelected){
				this.bot.watch();
				this.status.isVideoItemSelected = true;
				return;
			}
			
			// Skip Video Ads if available
			if(this.bot.isAtWatchScreen()){
				// TODO: Skip advertisement after atleast 5 seconds
				bot.skipAdvertisement();
				return;
			}
			
			// Perform Subscribe if required
			if(!this.status.isSubscribed && task.isSubscribeRequired){
				this.doSubscribe();
				return;
			}
			
			// Perform like if required
			if(!this.status.isLiked && task.isLikeRequired){
				this.doLike();
				return;
			}
			
			}
			catch(exception){
				clearInterval(interval);
				console.log({exception});
				// throw exception;			
			}

		}, 5000);
	}
	
	checkCurrentTask(){
		// TODO: Get current task from api.
		return task;
	}
	
	 doLike(){

				// Check if previously liked
				const isAlreadyLiked = bot.isVideoLiked();
				if(isAlreadyLiked) this.status.isLiked = true;
				
				// Skip if previously liked
				if(!isAlreadyLiked && bot.isAtWatchScreen()){
					
					// Only like if we have watched atleast 4 minutes
					const currentMinutes = bot.currentWatchSeconds() / 60;
					if(currentMinutes > 4){
						bot.likeVideo()
						this.status.isLiked = true;
					}	
				}
			
	}
	
	 doSubscribe(){
		
				// Check if previously subscribed
				const isPreviouslySubscribed = this.bot.isSubscribed();
				if(isPreviouslySubscribed()) this.status.isSubscribed = true;
				
				// Skip if previously subscribed
				if(!isPreviouslySubscribed && this.bot.isAtWatchScreen()){
				
					// Only subscribe if we have watched atleast 4 minutes video.
					const currentMinutes = this.bot.currentWatchSeconds() / 60;
					if(currentMinutes > 4){
						this.bot.subscribe();
						this.status.isSubscribed = true;
					}					
				}
			}
	
}

class YoutubeActions {
	constructor(task){
		this.task = task
	}

	search(){
		const searchInput = document.querySelector("input[name='search_query']")
		const searchButton = document.querySelector("button[aria-label='Search']")
		if(!searchInput) throw new Error("Search Input Not Found, Please update the selector");
		if(!searchButton) throw new Error("Search Button Not Found, Please update the selector");
		
		searchInput.value = this.task.searchQuery;
		searchButton.click()
	}
	
	isAtWatchScreen(){
		return document.location.pathname === "/watch";
	}
	
	watch(){
		const searchItem = document.querySelector(this.task.searchItemSelector);
		if(!searchItem) throw new Error("Search item not found, Please update the selector.");
		searchItem.click()
	}
	
	currentWatchSeconds(){
		const video = document.querySelector("video");
		if(!video) throw new Error("Video Element not found, Either You are not watching video or please update the selector.");
		return video.currentTime || 0;
	}
	
	skipAdvertisement(){
		const skipAdBtn = document.querySelector('.ytp-ad-text.ytp-ad-skip-button-text');
		const closeAdBannerBtn = document.querySelector('.ytp-ad-overlay-close-button')
		if(skipAdBtn) skipAdBtn.click();
		if(closeAdBannerBtn) closeAdBannerBtn.click();		
	}
	
	isVideoLiked(){
		const likesContainer = document.querySelector("div[id='actions']");
		if(!likesContainer) throw new Error("Likes container not found, please update the selector.");
		
		const likeBtn = Array.from(actions.querySelectorAll("button[aria-pressed='false']")).find(it => it.ariaLabel.includes("like this video along with"));
		
		return !likeBtn ? true: false;
	}
	
	likeVideo(){
		const likesContainer = document.querySelector("div[id='actions']");
		if(!likesContainer) throw new Error("Likes container not found, please update the selector.");
		
		const likeBtn = Array.from(actions.querySelectorAll("button[aria-pressed='false']")).find(it => it.ariaLabel.includes("like this video along with"));
		 
		if(!likeBtn) throw new Error("Like Button not found, please update the selector");
		likeBtn.click()
	}
	
	
	dislikeVideo(){
		const likesContainer = document.querySelector("div[id='actions']");
		if(!likesContainer) throw new Error("Likes container not found, please update the selector.");
		
		const dislikeBtn = Array.from(actions.querySelectorAll("button[aria-pressed='false']")).find(it => it.ariaLabel.includes("Dislike this video"));
		 
		if(!dislikeBtn) throw new Error("Dislike Button not found, please update the selector");
		dislikeBtn.click()
	}
	
	isSubscribed(){
		const subscribeContainer = document.querySelector("div[id='subscribe-button']");
		if(!subscribeContainer) throw new Error("Subscribe Container not found, please update the selector");
		
		const subscribeBtn = subscribeContainer.querySelector("button.yt-spec-button-shape-next--filled");
		return !subscribeBtn ? true: false;
	}
	
	subscribe(){
		const subscribeContainer = document.querySelector("div[id='subscribe-button']");
		if(!subscribeContainer) throw new Error("Subscribe Container not found, please update the selector");
		
		const subscribeBtn = subscribeContainer.querySelector("button.yt-spec-button-shape-next--filled");
		if(!subscribeBtn) throw new Error("Subscribe button not found, please update the selector.")
		subscribeBtn.click();
	}
}


