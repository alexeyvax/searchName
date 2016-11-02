
"use strict";

(function()
{
	const form = document.querySelector( 'form' );
	const field = form.querySelector( 'input' );
	const outputText = form.querySelector( 'div.output' );
	const storeCreatedElements = new Map();
	
	field.addEventListener( 'keyup', getList );
	
	function getList()
	{
		const method = form.method;
		const action = form.action;
		const request = new XMLHttpRequest();
		const value = field.value;
		
		request.addEventListener( 'load', send );
		request.open( method, action, true );
		request.send();

		function send()
		{
			console.log( method, action );
			if ( request.readyState === XMLHttpRequest.DONE
				&& request.status === 200 )
			{
				let text = JSON.parse( request.responseText );
				
				Array.prototype.forEach.call(
					text['list_person'],
					( item ) =>
					{
						let name = item['name'].toLowerCase();
						let surName = item['sur_name'].toLowerCase();
						
						if ( name.substr( 0, value.length ) === value
							|| surName.substr( 0, value.length ) === value )
						{
							if ( !storeCreatedElements.has( name ) )
							{
								let personContainer = createElements();
								
								personContainer[1].textContent = item['name'];
								personContainer[2].textContent = item['sur_name'];
								personContainer[3].textContent = item['age'];
								personContainer[4].textContent = item['male'];
								outputText.appendChild( personContainer[0] );
								
								storeCreatedElements.set( name, personContainer[0] );
							}
						}
						else
						{
							if ( storeCreatedElements.has( name ) )
							{
								outputText.removeChild( storeCreatedElements.get( name ) );
								storeCreatedElements.delete( name );
							}
						}
					}
				);

				if ( value === '' )
				{
					removeElements();
				}
			}
			else
			{
				console.log( 'Не прочитано' );
			}
		}
	}

	function createElements()
	{
		const personContainer = document.createElement( 'ul' );
		const nameContainer = document.createElement( 'li' );
		const surNameContainer = document.createElement( 'li' );
		const ageContainer = document.createElement( 'li' );
		const maleContainer = document.createElement( 'li' );

		personContainer.classList.add( 'person' );
		nameContainer.classList.add( 'name' );
		surNameContainer.classList.add( 'sur-name' );
		ageContainer.classList.add( 'age' );
		maleContainer.classList.add( 'male' );

		personContainer.appendChild( nameContainer );
		personContainer.appendChild( surNameContainer );
		personContainer.appendChild( ageContainer );
		personContainer.appendChild( maleContainer );

		return [personContainer, nameContainer, surNameContainer, ageContainer, maleContainer];
	}
	
	function removeElements()
	{
		if ( outputText.firstElementChild )
		{
			Array.prototype.forEach.call(
				outputText.querySelectorAll( 'UL' ),
				( item ) =>
				{
					outputText.removeChild( item );
				}
			);
		}
		
		storeCreatedElements.clear();
	}
})();
