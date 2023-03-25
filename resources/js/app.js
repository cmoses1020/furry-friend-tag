import './bootstrap';
import Alpine from 'alpinejs'
import Finder from './finder'


window.Alpine = Alpine

Alpine.data('finder', Finder)

import.meta.glob([
    '../images/**',
]);




Alpine.start()
