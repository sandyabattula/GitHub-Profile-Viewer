const usernameInput=document.getElementById("username");
const profile=document.getElementById("profile");

async function getProfile(){
const username=usernameInput.value.trim();

if(!username){
profile.innerHTML='<div class="error-card">Please enter a GitHub username</div>';
return;
}

profile.innerHTML='<div class="loader"></div>';

try{
const userResponse=await fetch(`https://api.github.com/users/${username}`);

if(!userResponse.ok){
throw new Error("User not found");
}

const user=await userResponse.json();

const repoResponse=await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
const repos=await repoResponse.json();

let repoCards="";

repos.forEach(repo=>{
repoCards+=`
<div class="repo-card">
<h4>${repo.name}</h4>
<p>${repo.description||"No description available"}</p>
<div class="repo-footer">
<span>⭐ ${repo.stargazers_count}</span>
<a href="${repo.html_url}" target="_blank">Open</a>
</div>
</div>
`;
});

profile.innerHTML=`
<div class="profile-card">

<div class="profile-left">
<img src="${user.avatar_url}" alt="${user.login}">
</div>

<div class="profile-right">

<div class="profile-header">
<h2>${user.name||user.login}</h2>
<p>@${user.login}</p>
</div>

<div class="bio">
${user.bio||"No bio available"}
</div>

<div class="extra-info">
<span>${user.location||"Location not available"}</span>
<span>${user.company||"No company listed"}</span>
</div>

<div class="stats">
<div class="stat-box">
<h3>${user.followers}</h3>
<p>Followers</p>
</div>

<div class="stat-box">
<h3>${user.following}</h3>
<p>Following</p>
</div>

<div class="stat-box">
<h3>${user.public_repos}</h3>
<p>Repositories</p>
</div>
</div>

<div class="actions">
<a href="${user.html_url}" target="_blank" class="github-btn">
View GitHub Profile
</a>
</div>

</div>

</div>

<div class="repo-section">
<h3>Recent Repositories</h3>
<div class="repo-grid">
${repoCards}
</div>
</div>
`;

}
catch(error){
profile.innerHTML=`
<div class="error-card">
User not found
</div>
`;
}
}

usernameInput.addEventListener("keypress",e=>{
if(e.key==="Enter"){
getProfile();
}
});