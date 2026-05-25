$(function(){
  const $form = $('#searchForm');
  const $username = $('#username');
  const $loader = $('#loader');
  const $profile = $('#profile');
  const $error = $('#error');
  const $avatar = $('#avatar');
  const $name = $('#name');
  const $bio = $('#bio');
  const $followers = $('#followers');
  const $following = $('#following');
  const $repos = $('#repos');
  const $repoList = $('#repoList');
  const $body = $('body');
  const $darkModeToggle = $('#darkModeToggle');
  
  // Initialize theme from localStorage
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if(savedTheme === 'light'){
    $body.addClass('light-mode');
    $darkModeToggle.text('☀️');
  }

  function extractUsername(input){
    if(!input) return '';
    let s = input.trim();
    if(s.indexOf('github.com') !== -1){
      s = s.replace(/^https?:\/\/(www\.)?github\.com\//i, '');
      s = s.replace(/\/.*$/,'');
    }
    s = s.replace(/^@/,'').trim();
    return s;
  }

  function showLoader(){ $loader.removeClass('hidden'); $profile.addClass('hidden'); $error.addClass('hidden'); }
  function hideLoader(){ $loader.addClass('hidden'); }

  function showError(msg){ hideLoader(); $error.text(msg).removeClass('hidden'); }

  function renderProfile(data){
    $avatar.attr('src', data.avatar_url);
    $name.text(data.name || data.login);
    $bio.text(data.bio || 'No bio available.');
    $followers.text(data.followers);
    $following.text(data.following);
    $repos.text(data.public_repos);
    $repoList.empty();
    $profile.removeClass('hidden').css({opacity:0,transform:'translateY(8px)'}).animate({opacity:1,transform:'translateY(0)'},500);
  }

  function renderRepos(items){
    const $repoCards = $('#repoCards');
    $repoCards.empty();
    
    if(!items || items.length===0){ 
      $('#reposSection').addClass('hidden');
      return; 
    }
    
    $('#reposSection').removeClass('hidden');
    
    items.forEach(r => {
      const langColor = getLanguageColor(r.language);
      const card = $('<div>').addClass('repo-card').html(`
        <div class="repo-card-name">
          <a href="${r.html_url}" target="_blank" rel="noopener noreferrer">${r.name}</a>
        </div>
        ${r.description ? `<div class="repo-card-desc">${r.description}</div>` : ''}
        <div class="repo-card-meta">
          ${r.language ? `<span><span class="repo-card-lang" style="background-color:${langColor}"></span>${r.language}</span>` : ''}
          ${r.stargazers_count ? `<span>⭐ ${r.stargazers_count}</span>` : ''}
          ${r.forks_count ? `<span>🍴 ${r.forks_count}</span>` : ''}
        </div>
      `);
      $repoCards.append(card);
    });
  }

  function getLanguageColor(lang){
    const colors = {
      'JavaScript': '#f1e05a',
      'TypeScript': '#3178c6',
      'Python': '#3572a5',
      'Java': '#b07219',
      'C++': '#00599c',
      'C#': '#239120',
      'PHP': '#777bb4',
      'Ruby': '#cc342d',
      'Go': '#00add8',
      'Rust': '#ce422b',
      'HTML': '#e34c26',
      'CSS': '#563d7c',
      'Vue': '#41b883',
      'React': '#61dafb',
      'default': '#2dd4bf'
    };
    return colors[lang] || colors['default'];
  }

  function fetchUser(username){
    showLoader();
    $.ajax({url:`https://api.github.com/users/${encodeURIComponent(username)}`,dataType:'json'})
      .done(function(data){
        renderProfile(data);
        // fetch all repos
        $.ajax({url:`https://api.github.com/users/${encodeURIComponent(username)}/repos`,data:{per_page:100,sort:'updated'},dataType:'json'})
          .done(function(repos){ renderRepos(repos); hideLoader(); })
          .fail(function(){ renderRepos([]); hideLoader(); });
      })
      .fail(function(xhr){
        if(xhr && xhr.status===404) showError('User not found. Please check the username.');
        else showError('Failed to fetch data. Check your network or try again later.');
      });
  }

  // Dark mode toggle
  $darkModeToggle.on('click', function(){
    $body.toggleClass('light-mode');
    const isLight = $body.hasClass('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    $darkModeToggle.text(isLight ? '☀️' : '🌙');
  });

  // Feature button handlers
  $('#darkModeBtn').on('click', function(){
    $darkModeToggle.click();
    $(this).toggleClass('active');
  });

  $('#repoCardsBtn').on('click', function(){
    $(this).toggleClass('active');
    showError('🎨 Enhanced repo cards feature coming soon!');
  });

  $('#contribGraphBtn').on('click', function(){
    $(this).toggleClass('active');
    showError('📊 Contribution graph coming soon!');
  });

  $('#searchHistoryBtn').on('click', function(){
    $(this).toggleClass('active');
    showError('⏰ Search history feature coming soon!');
  });

  $('#langChartBtn').on('click', function(){
    $(this).toggleClass('active');
    showError('📈 Language chart coming soon!');
  });

  $('#compareUsersBtn').on('click', function(){
    $(this).toggleClass('active');
    showError('🔄 Compare users feature coming soon!');
  });

  $('#pdfExportBtn').on('click', function(){
    $(this).toggleClass('active');
    showError('📄 PDF export feature coming soon!');
  });

  let autoSearchTimeout;
  
  // Auto search on input (with debounce)
  $username.on('input', function(){
    clearTimeout(autoSearchTimeout);
    const val = $(this).val().trim();
    if(val.length > 2){
      autoSearchTimeout = setTimeout(function(){
        const username = extractUsername(val);
        if(username){
          fetchUser(username);
        }
      }, 800);
    }
  });

  // Auto search on paste
  $username.on('paste', function(){
    setTimeout(function(){
      const raw = $username.val() || '';
      const val = extractUsername(raw);
      if(val){
        fetchUser(val);
      }
    }, 100);
  });

  $form.on('submit', function(e){
    e.preventDefault();
    const raw = $username.val() || '';
    const val = extractUsername(raw);
    if(!val){
      showError('Please enter a GitHub username or paste a profile URL.');
      return;
    }
    fetchUser(val);
  });
});
