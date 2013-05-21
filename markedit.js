(function($) {

	$.fn.markedit = function()
	{
		if ($(this).data('markedit')=='true') {
			return $(this);
		}

		var $editor = $(this),
		    content = $editor.val();

		var $newEditor = $('<div class="markedit" data-markedit />');

		$editor.after($newEditor);
		$oldEditor = $editor;//.detach();
		$editor = $newEditor;

		var replacement = {
			'#': '^\# (.*)',
			'##': '^\#\# (.*)',
			'###': '^\#\#\# (.*)',
			'####': '^\#\#\#\# (.*)',
			'#####': '^\#\#\#\#\# (.*)',
			'######': '^\#\#\#\#\#\# (.*)',
			'*': '^\\* (.*)',
			'>': '^\\> (.*)',
			'p': '(.*)'
		};

		var paragraphs = content.split(/\n\n/);

		for (var k in paragraphs) {

			var i,
			    content=paragraphs[k];
			for (i in replacement) {
				var expr = new RegExp(replacement[i], 'ig');
				if (expr.test(content) === true) {
					content = markdown.toHTML(content);
					break;
				}
			}

			if ($.trim(paragraphs[k]).length > 0) {
				$newP = $('<div class="paragraph"><div class="syntax"></div><div class="formatted"></div></div>');
				$newP.find('.syntax').html(i);
				$newP.find('.formatted').html(content);
				$newP.data('text', paragraphs[k]);
				$editor.append($newP);
			}
		}

		$(document).on('click', '[data-markedit] .paragraph', function() {
			var $p = $(this),
			    initHeight = parseInt($p.height());

			$p.addClass('edit');
	
			var $formatted = $p.find('.formatted');
			$formatted.html('<textarea style="overflow:hidden;">' + ($p.data('text') || '') + '</textarea>');

			var scrollHeigth=parseInt($p.find('textarea').prop('scrollHeight'));
			var $textarea = $p.find('textarea');

			$textarea
				.css('line-height', '16px')
				.height(initHeight)
				.focus();

			if (scrollHeigth > initHeight) {
				$textarea.height(scrollHeigth + parseInt($textarea.css('line-height')))
			}

			$textarea
				.on('click', function() {
					return false;
				})
				.on('keyup cut paste', function() {
					var scrollHeigth=parseInt($(this).prop('scrollHeight'));

					if ($(this).height() < scrollHeigth) {
						$(this).height(scrollHeigth + parseInt($(this).css('line-height')));
					}
				})
				.on('blur', function() {
					var paragraphs = $(this).val().split(/\n\n/);

					var firstUsed = false;

					for (var k in paragraphs) {

						var i,
						    content=paragraphs[k];
						for (i in replacement) {
							var expr = new RegExp(replacement[i], 'ig');
							if (expr.test(content) === true) {
								content = markdown.toHTML(content);
								break;
							}
						}

						if ($.trim(paragraphs[k]).length > 0) {
							if (firstUsed === false) {
								$p.find('.syntax').html(i);
								$p.find('.formatted').html(content);
								$p.removeClass('edit');
								$p.data('text', paragraphs[k]);
								firstUsed=true;
							} else {
								$newP = $('<div class="paragraph"><div class="syntax"></div><div class="formatted"></div></div>');
								$newP.find('.syntax').html(i);
								$newP.find('.formatted').html(content);
								$newP.data('text', paragraphs[k]);
								$p.after($newP);
							}
						}
					}

					if (firstUsed === false) {
						$p.remove();
					}

					// Set content to old TEXTAREA
					var paragraphsContent=[];

					$editor.find('.paragraph').each(function() {
						paragraphsContent.push($(this).data('text'));
					});

					$oldEditor.val(paragraphsContent.join('\n\n'));
					$oldEditor.trigger('change');
				});

			return false;
		});

		$editor.on('click', function(event) {
			if ($(event.target).is('[data-markedit]')) {
				$newP = $('<div class="paragraph"><div class="syntax"></div><div class="formatted"></div></div>');
				$editor.append($newP);
				$newP.trigger('click');
				$newP.find('textarea').height(35);
			}
		});

		$(this).css('display', 'none').data('markedit', 'true');

		return $(this);
	};

})(jQuery);
